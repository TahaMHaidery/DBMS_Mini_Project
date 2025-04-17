import { db } from "../db.js";

export const getAllStockTransactions = async (req, res) => {
  db.query("SELECT * FROM stocktransactions", (err, results) => {
    if (err) return res.status(500).json(err);
    return res.json({ results, count: results.length ?? 0 });
  });
};

export const getStockTransactionsCounts = (req, res) => {
  db.query(
    "SELECT COUNT(*) AS count FROM stocktransactions",
    (err, results) => {
      if (err) return res.status(500).json(err);
      return res.json({ count: results[0].count });
    }
  );
};
