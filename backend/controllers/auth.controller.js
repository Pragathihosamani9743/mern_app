import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { User } from "../models/user.model.js";

export const signup = async (req, res) => {
	const { email, password, name, role = "student", course = "MERN Bootcamp" } = req.body;

	try {
		if (!email || !password || !name) {
			throw new Error("All fields are required");
		}

		const userAlreadyExists = await User.findOne({ email });
		console.log("userAlreadyExists", userAlreadyExists);

		if (userAlreadyExists) {
			return res.status(400).json({ success: false, message: "User already exists" });
		}

		const hashedPassword = await bcryptjs.hash(password, 10);

		const user = new User({
			email,
			password: hashedPassword,
			name,
			role,
			course,
			enrollmentDate: new Date(),
		});

		await user.save();

		// Generate JWT token
		generateTokenAndSetCookie(res, user._id);

		res.status(201).json({
			success: true,
			message: "User created successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}
		const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		generateTokenAndSetCookie(res, user._id);

		user.lastLogin = new Date();
		await user.save();

		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const logout = async (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

// Get all students (Admin only)
export const getAllStudents = async (req, res) => {
	try {
		const user = await User.findById(req.userId);
		if (user.role !== "admin") {
			return res.status(403).json({ success: false, message: "Access denied. Admin only." });
		}

		const students = await User.find({ role: "student" }).select("-password");
		res.status(200).json({ success: true, students });
	} catch (error) {
		console.log("Error in getAllStudents ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

// Update student (Admin or own profile)
export const updateStudent = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, email, course } = req.body;
		const currentUser = await User.findById(req.userId);

		// Check if user can update this profile
		if (currentUser.role !== "admin" && currentUser._id.toString() !== id) {
			return res.status(403).json({ success: false, message: "Access denied" });
		}

		const updatedUser = await User.findByIdAndUpdate(
			id,
			{ name, email, course },
			{ new: true }
		).select("-password");

		if (!updatedUser) {
			return res.status(404).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, user: updatedUser });
	} catch (error) {
		console.log("Error in updateStudent ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

// Delete student (Admin only)
export const deleteStudent = async (req, res) => {
	try {
		const { id } = req.params;
		const currentUser = await User.findById(req.userId);

		if (currentUser.role !== "admin") {
			return res.status(403).json({ success: false, message: "Access denied. Admin only." });
		}

		const deletedUser = await User.findByIdAndDelete(id);
		if (!deletedUser) {
			return res.status(404).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, message: "Student deleted successfully" });
	} catch (error) {
		console.log("Error in deleteStudent ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const changePassword = async (req, res) => {
	const { currentPassword, newPassword } = req.body;

	try {
		const user = await User.findById(req.userId);
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Check if current password is correct
		const isCurrentPasswordValid = await bcryptjs.compare(currentPassword, user.password);
		if (!isCurrentPasswordValid) {
			return res.status(400).json({ success: false, message: "Current password is incorrect" });
		}

		// Hash new password
		const hashedNewPassword = await bcryptjs.hash(newPassword, 12);

		// Update password
		user.password = hashedNewPassword;
		await user.save();

		res.status(200).json({
			success: true,
			message: "Password changed successfully"
		});
	} catch (error) {
		console.log("Error in changePassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};
