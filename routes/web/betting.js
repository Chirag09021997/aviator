const express = require("express");
const router = express.Router();
const bettingController = require("../../controller/bettingController");

router.get("/", bettingController.index);
router.get("/getData", bettingController.getData);
router.get("/user-list/:id", bettingController.bettingUserList);
router.get("/:id", bettingController.show);
router.delete("/:id", bettingController.crashBetting);
module.exports = router;