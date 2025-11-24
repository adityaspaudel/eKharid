const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
// MONGODB_ATLAS_URI="mongodb+srv://adityaspaudel:adityaspaudel@cluster0.65gve6j.mongodb.net/?appName=Cluster0"
const dbConnect = async () => {
  try {
    const isConnected = await mongoose.connect(process.env.MONGODB_ATLAS_URI);

    if (!isConnected) {
      console.error("could not connect to mongodb");
    } else {
      console.log(`connected to ${process.env.MONGODB_ATLAS_URI}`);
    }
  } catch (error) {
    console.error(`database connection failed`);
  }
};

module.exports = dbConnect;
