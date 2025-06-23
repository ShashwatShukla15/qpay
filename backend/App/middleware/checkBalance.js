const Wallet = require('../models/Wallet');

const checkBalance = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const wallet = await Wallet.findOne({ user: req.user._id });

    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = checkBalance;