const express = require('express');

const {
  addProducts,
  getProducts,
  upload,
  updateProduct,
} = require('../controllers/productController');
const router = express.Router();

router.post(
  '/seller/:sellerId/addProducts',
  upload.array('images', 5),
  addProducts
);

router.get('/seller/:sellerId/getProducts', getProducts);
router.put('/product/:productId/updateProduct', updateProduct);

module.exports = router;
