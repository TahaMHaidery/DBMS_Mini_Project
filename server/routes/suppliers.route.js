import { Router } from "express";
import {
  getAllSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSuppliersCount,
} from "../controllers/suppliers.controller.js";

const router = Router();

router.route("/").get(getAllSuppliers);
router.route("/total").get(getSuppliersCount);
router.route("/").post(createSupplier);
router.route("/:supplierId").put(updateSupplier);
router.route("/:supplierId").delete(deleteSupplier);

export default router;
