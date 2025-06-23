let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let walletSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  }});

const Wallet = mongoose.model('Wallet', walletSchema);
module.exports = Wallet;