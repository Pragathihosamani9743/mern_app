import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ["admin", "student"],
			default: "student",
		},
		course: {
			type: String,
			default: "MERN Bootcamp",
		},
		enrollmentDate: {
			type: Date,
			default: Date.now,
		},
		lastLogin: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true }
);

export const User = mongoose.model("User", userSchema);
