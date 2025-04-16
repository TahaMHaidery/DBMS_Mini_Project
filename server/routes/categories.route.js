import { Router } from "express";
import {
  getAllCategories,
  getAllCategoriesCount,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categories.controller.js";

const router = Router();

router.route("/").get(getAllCategories);
router.route("/").post(createCategory);
router.route("/:categoryId").put(updateCategory);
router.route("/:categoryId").delete(deleteCategory);
router.route("/total").get(getAllCategoriesCount);

export default router;
