import { db } from "../db.js";

export const getAllOrders = async (req, res) => {
  try {
    db.query("SELECT * FROM Orders", (err, results) => {
      if (err) return res.status(500).json(err);
      return res.json({ results, count: results.length ?? 0 });
    });
  } catch (err) {
    console.error("Error getting orders:", err);
    res
      .status(500)
      .json({ message: "Error placing order", error: err.message });
  }
};

export const createOrder = async (req, res) => {
  const { orderDetails, orderType } = req.body;

  if (
    !orderDetails ||
    !Array.isArray(orderDetails) ||
    orderDetails.length === 0
  ) {
    return res.status(400).json({ message: "Invalid order data" });
  }

  try {
    // 1. Insert the order (initially as 'Pending')
    const insertOrderQuery =
      "INSERT INTO orders (UserID, OrderDate, Status, Type) VALUES (?, NOW(), 'Pending', ?)";
    const [orderResult] = await db
      .promise()
      .query(insertOrderQuery, [1, orderType]);
    const orderID = orderResult.insertId;

    // 2. Insert all order details
    const orderDetailPromises = orderDetails.map((item) => {
      const { productId, quantity } = item;
      const insertDetailQuery =
        "INSERT INTO orderdetails (OrderID, ProductID, Quantity) VALUES (?, ?, ?)";
      return db
        .promise()
        .query(insertDetailQuery, [orderID, productId, quantity]);
    });

    await Promise.all(orderDetailPromises);

    return res.status(200).json({ status: "success" });
  } catch (err) {
    console.error("Error placing order:", err);
    res
      .status(500)
      .json({ message: "Error placing order", error: err.message });
  }
};

export const getAllOrderCount = async (req, res) => {
  db.query("SELECT COUNT(OrderID) AS count FROM orders", (err, results) => {
    if (err) return res.status(500).json(err);
    return res.json({ count: results[0].count });
  });
};

export const updateStatus = (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const sql = `UPDATE Orders SET Status=? WHERE OrderID=?`;
  db.query(sql, [status, orderId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Order status updated" });
  });
};
