const dbConnect = require("./db/connection");

const express = require("express");
const app = express();
const path = require("path");

const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");

const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");

// middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// database connection
dbConnect();

// route
app.use(userRoute);
app.use(productRoute);

// default route
app.use("/", (req, res) => {
	console.log("app is running");
	res.send({ message: "app is running" });
});

// routing error handling
app.use((req, res) => {
	res.status(404).json({
		success: false,
		message: "Route not found",
	});
});

// Global error handler (Express)
app.use((err, req, res, next) => {
	console.error("Global Error:", err);

	const statusCode = err.statusCode || 500;

	res.status(statusCode).json({
		success: false,
		message: err.message || "Internal Server Error",
		stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
	});
});

// Catch unhandled errors
process.on("uncaughtException", (error) => {
	console.log("Uncaught Exception:", error);
});

process.on("unhandledRejection", (error) => {
	console.log("Unhandled Promise Rejection:", error.message);
});

// application
const port = process.env.PORT || 8000;
app.listen(port, () => {
	console.log(`application is running on http://localhost:${port}`);
});
