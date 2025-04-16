import express from "express";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllUserCount,
} from "../controllers/users.controller.js";

const router = express.Router();

router.get("/getAllUsers", getAllUsers);
router.get("/total", getAllUserCount);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
