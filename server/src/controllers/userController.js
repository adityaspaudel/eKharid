const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/userModel");

// user registration
const userRegistration = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      console.error(`please enter fullName, email and password`);
      res
        .status(204)
        .json({ message: `please enter fullName, email and password` });
    }
    const userByEmail = await User.findOne({ email });

    if (userByEmail) {
      console.error(`email is already registered, please try another email`);
      res.status(409).json({
        email: `email is already registered, please try another email,\n${userByEmail.email}`,
      });
    } else {
      const newUser = new User({ fullName, email, password });
      await newUser.save();

      console.log(
        `new user registered, fullName:${newUser.fullName}, email:${newUser.email}`
      );
      res.status(201).json({
        message: `new User registered`,
        fullName: newUser.fullName,
        email: newUser.email,
      });
    }
  } catch (error) {
    console.error(`error occurred while registering a new user\n${error}`);

    res.status(500).json({
      message: `error occurred while registering a new user, \n${error}`,
    });
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
    if (!userByEmail) {
      console.error(`user not found`);
      res.status(404).json({ message: `user not found` });
    }
    if (userByEmail.email === email && userByEmail.password === password) {
      console.log(`user login successful`);

      res.status(200).json({ message: `user login successful,\n${email}` });
    }
  } catch (error) {
    console.error(`user login failed`);
    res.status(500).json(`user login failed,\n${error}`);
  }
};

module.exports = { userRegistration, userLogin };
