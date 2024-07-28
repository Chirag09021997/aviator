const express = require("express");
const router = express.Router();
const paymentWithdrawController = require("../../controller/paymentWithdrawController");
const { upload } = require('../../services/fileUpload');

router.get("/", paymentWithdrawController.index);
router.get("/:id", paymentWithdrawController.show);
router.get("/:id/edit", paymentWithdrawController.edit);
router.post("/:id/update", upload.single('photo'), paymentWithdrawController.update);
router.delete("/:id", paymentWithdrawController.deleteRecord);

module.exports = router;