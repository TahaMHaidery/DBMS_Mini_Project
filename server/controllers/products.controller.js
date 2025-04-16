import { db } from "../db.js";

export const getAllProducts = (req, res) => {
  db.query("SELECT * FROM Products", (err, results) => {
    if (err) return res.status(500).json(err);
    return res.json({ results, count: results.length ?? 0 });
  });
};

export const getProductsCounts = (req, res) => {
  db.query("SELECT COUNT(*) AS count FROM Products", (err, results) => {
    if (err) return res.status(500).json(err);
    return res.json({ count: results[0].count });
  });
};

export const createProduct = (req, res) => {
  const { name, category, supplier, quantity, pricePerUnit, reorderLevel } =
    req.body;
  const sql = `INSERT INTO Products (ProductName, CategoryID, SupplierID, QuantityInStock, PricePerUnit, ReorderLevel) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(
    sql,
    [name, category, supplier, quantity, pricePerUnit, reorderLevel],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "User added" });
    }
  );
};

export const updateProduct = (req, res) => {
  const { productId } = req.params;
  const { name, category, supplier, quantity, pricePerUnit, reorderLevel } =
    req.body;
  const sql = `UPDATE Products SET ProductName=?, CategoryID=?, SupplierID=?, QuantityInStock=?, PricePerUnit=?, ReorderLevel=? WHERE ProductID=?`;
  db.query(
    sql,
    [name, category, supplier, quantity, pricePerUnit, reorderLevel, productId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "User added" });
    }
  );
};

export const deleteProduct = (req, res) => {
  const { productId } = req.params;

  const sql = `DELETE FROM Products WHERE ProductID=?`;
  db.query(sql, [productId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "User added" });
  });
};
