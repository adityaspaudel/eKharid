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
			console.error(`please enter email and password`);
			res.status(204).json({ message: `please enter email and password` });
		}
		const userByEmail = await User.findOne({ email });

		const isMatch = await bcrypt.compare(password, userByEmail.password);

		if (!isMatch) {
			console.error(`user not found`);
			res.status(404).json({ message: `user not found` });
		} else {
			console.log(`user login successful`, userByEmail);
			const token = jwt.sign({ id: userByEmail._id }, JWT_SECRET, {
				expiresIn: "7d",
			});

			res.status(200).json({
				message: `user login successful`,
				email: userByEmail.email,
				username: userByEmail.username,
				role: userByEmail.role,
				token,
			});
		}
	} catch (error) {
		console.error(`user login failed`);
		res.status(500).json(`user login failed,\n${error}`);
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
