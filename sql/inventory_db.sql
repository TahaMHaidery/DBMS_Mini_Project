CREATE DATABASE IF NOT EXISTS inventory_db;
USE inventory_db;

CREATE TABLE IF NOT EXISTS UserRoles (
  RoleID INT AUTO_INCREMENT PRIMARY KEY,
  RoleName VARCHAR(50) NOT NULL UNIQUE,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Users (
  UserID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(50) NOT NULL,
  Password VARCHAR(255) NOT NULL,
  Email VARCHAR(100) UNIQUE NOT NULL,
  RoleID INT,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (RoleID) REFERENCES UserRoles(RoleID)
);

CREATE TABLE IF NOT EXISTS Categories (
  CategoryID INT AUTO_INCREMENT PRIMARY KEY,
  CategoryName VARCHAR(100) NOT NULL UNIQUE,
  Description TEXT,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Suppliers (
  SupplierID INT AUTO_INCREMENT PRIMARY KEY,
  SupplierName VARCHAR(100) NOT NULL UNIQUE,
  ContactPerson VARCHAR(100),
  Phone VARCHAR(20),
  Email VARCHAR(100),
  Address TEXT,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Products (
  ProductID INT AUTO_INCREMENT PRIMARY KEY,
  ProductName VARCHAR(100) NOT NULL UNIQUE,
  CategoryID INT,
  SupplierID INT,
  QuantityInStock INT DEFAULT 0,
  PricePerUnit DECIMAL(10,2) NOT NULL,
  ReorderLevel INT DEFAULT 5,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID),
  FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
);

CREATE TABLE IF NOT EXISTS StockTransactions (
  TransactionID INT AUTO_INCREMENT PRIMARY KEY,
  ProductID INT,
  Quantity INT NOT NULL,
  TransactionType ENUM('In', 'Out') NOT NULL,
  TransactionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

CREATE TABLE IF NOT EXISTS Orders (
  OrderID INT AUTO_INCREMENT PRIMARY KEY,
  UserID INT,
  OrderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  Status ENUM('Pending', 'Completed', 'Cancelled') DEFAULT 'Pending',
  Type ENUM('Purchase', 'Sale') NOT NULL,
  FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE IF NOT EXISTS OrderDetails (
  OrderDetailID INT AUTO_INCREMENT PRIMARY KEY,
  OrderID INT,
  ProductID INT,
  Quantity INT NOT NULL,
  FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
  FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

DROP TRIGGER IF EXISTS trg_UpdateStock_OnOrderComplete;

DELIMITER $$

CREATE TRIGGER trg_UpdateStock_OnOrderComplete
BEFORE UPDATE ON Orders
FOR EACH ROW
BEGIN
  IF OLD.Status = 'Pending' AND NEW.Status = 'Completed' THEN
    DECLARE done INT DEFAULT FALSE;
    DECLARE vProductID INT;
    DECLARE vQuantity INT;
    DECLARE cur CURSOR FOR
      SELECT ProductID, Quantity FROM OrderDetails WHERE OrderID = NEW.OrderID;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;

    read_loop: LOOP
      FETCH cur INTO vProductID, vQuantity;
      IF done THEN
        LEAVE read_loop;
      END IF;

      -- Sale case
      IF NEW.Type = 'Sale' THEN
        IF (SELECT QuantityInStock FROM Products WHERE ProductID = vProductID) < vQuantity THEN
          SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: Sale quantity exceeds stock';
        END IF;

        UPDATE Products
        SET QuantityInStock = QuantityInStock - vQuantity
        WHERE ProductID = vProductID;

      -- Purchase case
      ELSEIF NEW.Type = 'Purchase' THEN
        UPDATE Products
        SET QuantityInStock = QuantityInStock + vQuantity
        WHERE ProductID = vProductID;
      END IF;

    END LOOP;

    CLOSE cur;
  END IF;
END$$

DELIMITER ;
