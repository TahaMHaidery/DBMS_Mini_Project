import { Router } from "express";
import {
  getAllStockTransactions,
  getStockTransactionsCounts,
} from "../controllers/stocktransaction.controller.js";

const router = Router();

router.route("/").get(getAllStockTransactions);
router.route("/total").get(getStockTransactionsCounts);

export default router;
