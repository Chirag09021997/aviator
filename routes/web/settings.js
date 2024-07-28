const express = require("express");
const router = express.Router();
const settingController = require("../../controller/settingController");

router.get("/", settingController.index);

router.get("/create", settingController.create);
router.post("/store", settingController.store);
router.get("/:id", settingController.show);

router.get("/:id/edit", settingController.edit);
router.post("/:id/update", settingController.update);
router.delete("/:id", settingController.deleteRecord);

module.exports = router;