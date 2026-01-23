/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			// For local development images
			{
				protocol: "http",
				hostname: "localhost",
				port: "8000",
				pathname: "/**",
			},
			// For Cloudinary images (Required for your new error)
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
