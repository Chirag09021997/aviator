const express = require("express");
const router = express.Router();
const paymentDepositController = require("../../controller/paymentDepositController");
const { upload } = require('../../services/fileUpload');
router.get("/", paymentDepositController.index);
router.get("/:id", paymentDepositController.show);
router.get("/:id/edit", paymentDepositController.edit);
router.post("/:id/update", upload.single('photo'), paymentDepositController.update);
router.delete("/:id", paymentDepositController.deleteRecord);

module.exports = router;