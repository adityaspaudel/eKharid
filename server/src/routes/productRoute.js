const express = require("express");

const {
  addProducts,
  getProducts,
  upload,
} = require("../controllers/productController");
const router = express.Router();

router.post("/seller/addProducts", upload.array("images", 5), addProducts);

router.get("/seller/getProducts", getProducts);

module.exports = router;
