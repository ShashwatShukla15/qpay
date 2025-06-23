let express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {
  verify,
  getWallet,
  deposit,
  transfer,
  withdraw
} = require('../../controllers/walletController');

// All routes require authentication
router.use(auth);

router.get('/', getWallet);
router.post('/deposit', deposit);
router.post('/transfer', transfer);
router.post('/withdraw', withdraw);
router.post('/verify', verify);

module.exports = router;
