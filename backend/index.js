let express = require("express");
let mongoose = require("mongoose");
let cors = require("cors");
require("dotenv").config();

const authRoutes = require('./App/routes/web/auth');
const walletRoutes = require('./App/routes/web/wallet');
const transactionRoutes = require('./App/routes/web/transactions');

let app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/transactions', transactionRoutes);

// Connect to MongoDB
mongoose.connect(process.env.DB_URI).then(() => {
  console.log("Connected to MongoDB");
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
  });
}).catch(err => {
  console.error("MongoDB connection error:", err);
});