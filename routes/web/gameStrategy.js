const express = require("express");
const router = express.Router();
const gameStrategyController = require("../../controller/gameStrategyController");

router.get("/", gameStrategyController.index);

router.get("/create", gameStrategyController.create);
router.post("/store", gameStrategyController.store);
router.get("/:id", gameStrategyController.show);

router.get("/:id/edit", gameStrategyController.edit);
router.post("/:id/update", gameStrategyController.update);
router.delete("/:id", gameStrategyController.deleteRecord);

module.exports = router;