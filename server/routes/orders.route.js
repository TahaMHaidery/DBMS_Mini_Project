import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getAllOrderCount,
  updateStatus,
} from "../controllers/orders.controller.js";

const router = Router();

router.route("/").get(getAllOrders);
router.route("/").post(createOrder);
router.route("/total").get(getAllOrderCount);
router.route("/:orderId/updateStatus").patch(updateStatus);

export default router;
