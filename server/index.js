import express from "express";
import cors from "cors";

const app = express();

import usersRoute from "./routes/users.route.js";
import categoriesRoute from "./routes/categories.route.js";
import suppliersRoute from "./routes/suppliers.route.js";
import productsRoute from "./routes/products.route.js";
import orderRoute from "./routes/orders.route.js";

app.use(cors());
app.use(express.json());

app.use("/api/users", usersRoute);
app.use("/api/categories", categoriesRoute);
app.use("/api/suppliers", suppliersRoute);
app.use("/api/products", productsRoute);
app.use("/api/orders", orderRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
