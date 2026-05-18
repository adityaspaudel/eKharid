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

// security middleware
app.use(helmet());

app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
	}),
);

app.use(compression());

app.use(morgan("dev"));

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser
app.use(cookieParser());

// static folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// database connection
dbConnect();

// routes
app.use(userRoute);
app.use(productRoute);

// default route
app.get("", (req, res) => {
	res.status(200).json({
		success: true,
		message: "app is running",
	});
});

// 404 route handler
app.use((req, res) => {
	res.status(404).json({
		success: false,
		message: "Route not found",
	});
});

// global error handler
app.use((err, req, res, next) => {
	console.error("Global Error:", err);

	res.status(err.statusCode || 500).json({
		success: false,
		message: err.message || "Internal Server Error",
		stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
	});
});

// uncaught exception
process.on("uncaughtException", (error) => {
	console.error("Uncaught Exception:", error);

	process.exit(1);
});

// app listen
const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});

// unhandled rejection
process.on("unhandledRejection", (error) => {
	console.error("Unhandled Rejection:", error);

	server.close(() => {
		process.exit(1);
	});
});
