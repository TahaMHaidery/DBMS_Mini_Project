import { db } from "../db.js";

export const getAllSuppliers = (req, res) => {
  db.query("SELECT * FROM SUPPLIERS", (err, results) => {
    if (err) return res.status(500).json(err);
    return res.json({ results, count: results.length ?? 0 });
  });
};

export const getSuppliersCount = (req, res) => {
  db.query("SELECT COUNT(*) AS count FROM SUPPLIERS", (err, results) => {
    if (err) return res.status(500).json(err);
    return res.json({ count: results[0].count });
  });
};

export const createSupplier = (req, res) => {
  const { name, contactPerson, phone, email, address } = req.body;
  const sql = `INSERT INTO Suppliers (SupplierName , ContactPerson, Phone, Email, Address) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [name, contactPerson, phone, email, address], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Supplier added" });
  });
};

export const updateSupplier = (req, res) => {
  const { supplierId } = req.params;
  const { name, contactPerson, phone, email, address } = req.body;
  const sql = `UPDATE Suppliers SET SupplierName=? , ContactPerson=?, Phone=?, Email=?, Address=? WHERE SupplierID=?`;
  db.query(
    sql,
    [name, contactPerson, phone, email, address, supplierId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Supplier updated" });
    }
  );
};

export const deleteSupplier = (req, res) => {
  const { supplierId } = req.params;
  const sql = `DELETE FROM Suppliers WHERE SupplierID=?`;
  db.query(sql, [supplierId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Supplier deleted" });
  });
};
