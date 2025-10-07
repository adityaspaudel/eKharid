const dbConnect = require("./db/connection");
const express = require("express");

const app = express();

const cors = require("cors");
// middleware

app.use(express.json());
app.use(cors());

// database connection

dbConnect();

// application
const port = 8000;
app.listen(port, () => {
  console.log(`application is running on port: ${port}`);
});
