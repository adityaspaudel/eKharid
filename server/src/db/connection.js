const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const dbConnect = async () => {
	try {
		const isConnected = await mongoose.connect(
			process.env.MONGODB_URI ||
				"mongodb+srv://eKharid:eKharid@cluster0.3zbwaky.mongodb.net/?appName=Cluster0",
		);

		if (!isConnected) {
			console.error("could not connect to mongodb");
		} else {
			console.log(`connected to ${process.env.MONGODB_URI}`);
		}
	} catch (error) {
		console.error(`database connection failed`);
	}
};

module.exports = dbConnect;
