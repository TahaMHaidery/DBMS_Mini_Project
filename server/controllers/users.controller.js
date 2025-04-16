import { db } from "../db.js";

const getAllUsers = (req, res) => {
  const sql = `
    SELECT users.*, userroles.RoleName
    FROM Users
    LEFT JOIN userroles ON users.RoleID = userroles.RoleID
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ results, count: results.length ?? 0 });
  });
};

const createUser = (req, res) => {
  const { name, email, password, roleId } = req.body;
  const sql = `INSERT INTO Users (Name, Email, Password, RoleID) VALUES (?, ?, ?, ?)`;
  db.query(sql, [name, email, password, roleId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "User added" });
  });
};

const updateUser = (req, res) => {
  const { name, email, roleId } = req.body;
  const userId = req.params.id;
  const sql = `UPDATE Users SET Name=?, Email=?, RoleID=? WHERE UserID=?`;
  db.query(sql, [name, email, roleId, userId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User updated" });
  });
};

const deleteUser = (req, res) => {
  const userId = req.params.id;
  const sql = `DELETE FROM Users WHERE UserID=?`;
  db.query(sql, [userId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User deleted" });
  });
};

const getAllUserCount = async (req, res) => {
  db.query("SELECT COUNT(Name) AS count FROM users", (err, results) => {
    if (err) return res.status(500).json(err);
    return res.json({ count: results[0].count });
  });
};

export { getAllUsers, createUser, updateUser, deleteUser, getAllUserCount };
