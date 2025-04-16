import mysql from "mysql2"

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Taha@2005",
  database: "inventory_db"
});

conn.connect(err => {
  if (err) throw err;
  console.log("Connected to MySQL DB");
});

export const db = conn;