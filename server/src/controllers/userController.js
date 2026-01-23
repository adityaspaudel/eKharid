const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "fjdn34JNRF34kDNSK3fnckdsaW";
// user registration
const userRegistration = async (req, res) => {
	try {
		const { fullName, username, email, password, confirmPassword, role } =
			req.body;

		// Validate required fields
		if (
			!fullName ||
			!username ||
			!email ||
			!password ||
			!confirmPassword ||
			!role
		) {
			return res
				.status(400)
				.json({ message: "Please fill in all required fields" });
		}

		// Check password match
		if (password !== confirmPassword) {
			return res.status(400).json({ message: "Passwords do not match" });
		}

		// Check duplicates
		const userByEmail = await User.findOne({ email });
		if (userByEmail) {
			return res.status(409).json({ message: "Email is already registered" });
		}

		const userByUsername = await User.findOne({ username });
		if (userByUsername) {
			return res.status(409).json({ message: "Username is already taken" });
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create and save user
		const newUser = new User({
			fullName,
			username,
			email,
			password: hashedPassword,
			role,
		});
		await newUser.save();

		console.log(
			`✅ New user registered: ${newUser.fullName} (${newUser.email})`,
		);

		return res.status(201).json({
			message: "User registered successfully",
			user: {
				fullName: newUser.fullName,
				username: newUser.username,
				email: newUser.email,
				role: newUser.role,
			},
		});
	} catch (error) {
		console.error("❌ Error while registering user:", error);
		return res
			.status(500)
			.json({ message: "Server error during registration" });
	}
};
const userLogin = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				message: "Email and password are required",
			});
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({
				message: "Invalid email or password",
			});
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({
				message: "Invalid email or password",
			});
		}

		const token = jwt.sign(
			{ id: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "7d" },
		);

		// ✅ Send token in response (NO cookie)
		return res.status(200).json({
			message: "Login successful",
			token,
			user: {
				_id: user._id,
				email: user.email,
				username: user.username,
				role: user.role,
			},
		});
	} catch (error) {
		console.error("Login failed:", error);
		return res.status(500).json({
			message: "Internal server error",
		});
	}
};

const getSellerDetails = async (req, res) => {
	try {
		const seller = await User.findById(req.params.sellerId).select(
			"fullName email",
		);
		if (!seller) return res.status(404).json({ message: "Seller not found" });
		res.status(200).json({ seller });
	} catch (error) {
		console.error(error.message);
		res
			.status(500)
			.json({ message: "Error fetching seller", error: error.message });
	}
};
module.exports = { userRegistration, userLogin, getSellerDetails };
