import { Router } from "express";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsCounts,
} from "../controllers/products.controller.js";

const router = Router();

router.route("/").get(getAllProducts);
router.route("/total").get(getProductsCounts);
router.route("/").post(createProduct);
router.route("/:productId").put(updateProduct);
router.route("/:productId").delete(deleteProduct);

export default router;
