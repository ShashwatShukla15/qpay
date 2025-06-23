let mongoose = require("mongoose");

let Schema = mongoose.Schema;

const transactionSchema = new Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: ['deposit', 'transfer', 'withdrawal'],
    required: true
  },
  status: {
    type: String,
    enum: ['success', 'pending', 'failed'],
    default: 'success'
  },
  message: {
    type: String
  }
}, {
  timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
