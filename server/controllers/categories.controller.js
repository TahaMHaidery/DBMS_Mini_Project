import { db } from "../db.js";

const getAllCategories = async (req, res) => {
  db.query("SELECT * FROM categories", (err, results) => {
    if (err) return res.status(500).json(err);
    return res.json({ results, count: results.length ?? 0 });
  });
};

const getAllCategoriesCount = async (req, res) => {
  db.query(
    "SELECT COUNT(CategoryName) AS count FROM categories",
    (err, results) => {
      if (err) return res.status(500).json(err);
      return res.json({ count: results[0].count });
    }
  );
};

const createCategory = async (req, res) => {
  const { name, description } = req.body;
  const sql = `INSERT INTO Categories (CategoryName, Description) VALUES (?, ?)`;
  db.query(sql, [name, description], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "category added" });
  });
};

const updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { name, description } = req.body;
  const sql = `UPDATE Categories SET CategoryName=?, Description=? WHERE CategoryID=?`;
  db.query(sql, [name, description, parseInt(categoryId)], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "category updated" });
  });
};

const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;
  const sql = `DELETE FROM Categories WHERE CategoryID=?`;
  db.query(sql, [categoryId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "category deleted" });
  });
};

export {
  getAllCategories,
  getAllCategoriesCount,
  createCategory,
  updateCategory,
  deleteCategory,
};
