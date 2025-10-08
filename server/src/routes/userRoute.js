const { userRegistration } = require("../controllers/userController");

const express = require("express");
const router = express.Router();

router.post("/user/userRegistration", userRegistration);


module.exports=router
