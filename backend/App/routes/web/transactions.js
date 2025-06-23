let express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const { getUserTransactions } = require("../../controllers/transactionController");

router.use(auth);

router.get("/", getUserTransactions);

module.exports = router;
