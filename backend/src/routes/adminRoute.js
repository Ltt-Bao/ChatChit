import express from "express";
import { getAllUsers, updateUserStatus } from "../controllers/adminController.js";
import { authorizeRoles, protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protectedRoute, authorizeRoles("admin")); // Chỉ cho phép admin truy cập các route ở dưới
router.get("/users", getAllUsers);
router.patch("/users/:userId/status", updateUserStatus);

export default router;