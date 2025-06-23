const Transaction = require('../models/Transaction');

const getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    }).sort({ createdAt: -1 });

    res.json({transactions});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getUserTransactions };
