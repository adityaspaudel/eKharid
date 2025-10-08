const dbConnect = require("./db/connection");


const express = require("express");
const app = express();

const cors = require("cors");

const userRoute = require("./routes/userRoute");

// middleware

app.use(express.json());
app.use(cors());

// database connection

dbConnect();

// route

app.use(userRoute);
// application
const port = 8000;
app.listen(port, () => {
  console.log(`application is running on port: ${port}`);
});
