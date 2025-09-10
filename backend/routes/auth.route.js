import express from "express";
import {
	login,
	logout,
	signup,
	checkAuth,
	getAllStudents,
	updateStudent,
	deleteStudent,
	changePassword,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Protected routes
router.get("/check-auth", verifyToken, checkAuth);
router.get("/students", verifyToken, getAllStudents);
router.put("/students/:id", verifyToken, updateStudent);
router.delete("/students/:id", verifyToken, deleteStudent);
router.put("/change-password", verifyToken, changePassword);

export default router;
