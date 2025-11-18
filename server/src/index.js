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

// application
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`application is running on http://localhost:${port}`);
});
