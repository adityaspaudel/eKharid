const {
  userRegistration,
  userLogin,
  getSellerDetails,
} = require('../controllers/userController');

const express = require('express');
const router = express.Router();

router.post('/user/userRegistration', userRegistration);
router.post('/user/userLogin', userLogin);
router.get('/seller/:sellerId/getSellerDetails', getSellerDetails);

module.exports = router;
