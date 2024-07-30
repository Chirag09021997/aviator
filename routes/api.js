const express = require('express');
const router = express.Router();
const ApiController = require("../controller/Api/ApiController");
const { upload } = require("../services/fileUpload");

router.post('/register', ApiController.UserRegister);
router.post("/payment-deposit", upload.single('photo'), ApiController.paymentDeposit);
router.post("/payment-withdraw", ApiController.paymentWithdraw);
router.post("/wallet", ApiController.walletList);
router.post("/my-bet", ApiController.myBet);
module.exports = router;
