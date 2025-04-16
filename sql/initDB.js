import mysql from "mysql2";
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Taha@2005",
  multipleStatements: true,
});

const dbName = "inventory_db";

const ddlScript = `
CREATE DATABASE IF NOT EXISTS ${dbName};
USE ${dbName};

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
  TotalAmount DECIMAL(10,2) NOT NULL,
  Status ENUM('Pending', 'Completed', 'Cancelled') DEFAULT 'Pending',
  FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE IF NOT EXISTS OrderDetails (
  OrderDetailID INT AUTO_INCREMENT PRIMARY KEY,
  OrderID INT,
  ProductID INT,
  Quantity INT NOT NULL,
  Price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
  FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);
`;

connection.connect((err) => {
  if (err) throw err;
  console.log("✅ Connected to MySQL");

  connection.query(ddlScript, (err, results) => {
    if (err) throw err;
    console.log("✅ All tables created successfully in 'inventory_db'");
    connection.end();
  });
});
