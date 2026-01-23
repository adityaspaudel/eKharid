require("dotenv").config();
const cloudinary = require("cloudinary").v2;

console.log("ENV CHECK:", {
	cloud: process.env.CLOUDINARY_CLOUD_NAME,
	key: process.env.CLOUDINARY_API_KEY,
	secret: process.env.CLOUDINARY_API_SECRET,
});

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

cloudinary.api
	.ping()
	.then(() => console.log("✅ Cloudinary auth SUCCESS"))
	.catch((err) => console.error("❌ Cloudinary auth FAILED:", err));

module.exports = cloudinary;
