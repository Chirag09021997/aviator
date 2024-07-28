const express = require("express");
const router = express.Router();
const upiRegisterController = require("../../controller/upiRegisterController");
const { upload } = require('../../services/fileUpload');

router.get("/", upiRegisterController.index);
router.get("/create", upiRegisterController.create);
router.post("/store", upload.single('barcode_photo'), upiRegisterController.store);
router.get("/:id", upiRegisterController.show);

router.get("/:id/edit", upiRegisterController.edit);
router.post("/:id/update", upload.single('barcode_photo'), upiRegisterController.update);
router.delete("/:id", upiRegisterController.deleteRecord);
router.put("/status/:id", upiRegisterController.changeStatus);

module.exports = router;