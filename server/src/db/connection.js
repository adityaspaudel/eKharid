const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const dbConnect = async () => {
  try {
    const isConnected = await mongoose.connect(process.env.MONGODB_URI);

    if (!isConnected) {
      console.error("could not connect to mongodb");
    } else {
      console.log("connected to mongodb://127.0.0.1:27017/eKharid");
    }
  } catch (error) {
    console.error(`database connection failed`);
  }
};

module.exports = dbConnect;
