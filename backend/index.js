import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { connectDB } from "./db/connectDB.js";

import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();


// CORS configuration for both local and deployed environments
const allowedOrigins = [];
if (process.env.FRONTEND_URL) allowedOrigins.push(process.env.FRONTEND_URL);
if (process.env.CLIENT_URL) allowedOrigins.push(process.env.CLIENT_URL);
if (process.env.VERCEL_URL) allowedOrigins.push(process.env.VERCEL_URL);
if (process.env.NODE_ENV !== "production") allowedOrigins.push("http://localhost:5173");

const corsOptions = {
	origin: function (origin, callback) {
		// allow requests with no origin (like mobile apps, curl, etc.)
		if (!origin) return callback(null, true);
		if (allowedOrigins.includes(origin)) return callback(null, true);
		return callback(new Error("Not allowed by CORS"));
	},
	credentials: true,
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));

app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies

app.use("/api/auth", authRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
	res.json({ message: "Backend is running!", timestamp: new Date().toISOString() });
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}


// Connect to database only if not already connected (for serverless)
if (!global._mongooseConnected) {
	connectDB();
	global._mongooseConnected = true;
}

// Start server for local development
if (!process.env.VERCEL) {
	app.listen(PORT, () => {
		console.log("Server is running on port no: ", PORT);
	});
}

export default app;
