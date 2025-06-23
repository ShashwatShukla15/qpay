const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Wallet = require('../models/Wallet');

const verify = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const user = await User.findOne({ phone: phoneNumber });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone
      }
    });
  } catch (err) {
    console.error('Verify recipient error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get current user's wallet
const getWallet = async (req, res) => {
  try {
    console.log('Fetching wallet for user:', req.user._id);
    const { Types } = require('mongoose');
    const wallet = await Wallet.findOne({ user: new Types.ObjectId(req.user._id) });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

    console.log('Fetched wallet:', wallet);
    console.log('Type of req.user._id:', typeof req.user._id);

    console.log('Wallet found:', wallet);
    res.json({wallet});
  } catch (err) {
    console.error('Wallet fetch error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Deposit money into wallet
const deposit = async (req, res) => {
  try {
    const { amount } = req.body;

    let wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      wallet = new Wallet({ user: req.user._id, balance: 0 });
    }

    wallet.balance += amount;
    await wallet.save();

    const transaction = new Transaction({
      sender: null,
      receiver: req.user._id,
      amount,
      type: 'deposit',
      status: 'success'
    });
    await transaction.save();

    res.status(200).json({ wallet, transaction });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Transfer to another user's wallet
const transfer = async (req, res) => {
  try {
    const { recipientPhone, amount } = req.body;

    const senderWallet = await Wallet.findOne({ user: req.user._id });
    if (!senderWallet || senderWallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const recipientUser = await require('../models/User').findOne({ phone: recipientPhone });
    if (!recipientUser) return res.status(404).json({ message: 'Recipient not found' });

    if (recipientUser._id.equals(req.user._id)) {
      return res.status(400).json({ message: 'You cannot transfer money to yourself' });
    }

    const recipientWallet = await Wallet.findOne({ user: recipientUser._id }) ||
                            new Wallet({ user: recipientUser._id, balance: 0 });

    // Update balances
    senderWallet.balance -= amount;
    recipientWallet.balance += amount;

    await senderWallet.save();
    await recipientWallet.save();

    const transaction = new Transaction({
      sender: req.user._id,
      receiver: recipientUser._id,
      amount,
      type: 'transfer',
      status: 'success'
    });
    await transaction.save();

    res.status(200).json({ transaction });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Withdraw money from wallet
const withdraw = async (req, res) => {
  try {
    console.log('Withdraw endpoint hit');
    const { amount, bankDetails } = req.body;
    console.log('Amount:', amount);
    console.log('Bank details:', bankDetails);
    console.log('User:', req.user);

    let wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    wallet.balance -= amount;
    await wallet.save();

    const transaction = new Transaction({
      sender: req.user._id,
      receiver: null,
      amount,
      type: 'withdrawal',
      status: 'success'
    });
    await transaction.save();

    res.status(200).json({ wallet, transaction });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { verify, getWallet, deposit, transfer, withdraw};
