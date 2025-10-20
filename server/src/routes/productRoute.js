const express = require("express");

const {
  addProducts,
  getProducts,
  upload,
  updateProduct,
  getAllProducts,
  getProductById,
  deleteProductById,
} = require("../controllers/productController");
const router = express.Router();

router.post(
  "/seller/:sellerId/addProducts",
  upload.array("images", 5),
  addProducts
);

router.get("/seller/:sellerId/getProducts", getProducts);
router.put(
  "/product/:productId/updateProduct",
  upload.array("images", 5),
  updateProduct
);
router.get("/product/getAllProducts", getAllProducts);
router.get("/product/:productId/getProductById", getProductById);
router.delete("/product/:productId/deleteProductById", deleteProductById);
module.exports = router;
