const express = require("express");
const router = express.Router();
const betSuggestionController = require("../../controller/betSuggestionController");

router.get("/", betSuggestionController.index);

router.get("/create", betSuggestionController.create);
router.post("/store", betSuggestionController.store);
router.get("/:id", betSuggestionController.show);

router.get("/:id/edit", betSuggestionController.edit);
router.post("/:id/update", betSuggestionController.update);
router.delete("/:id", betSuggestionController.deleteRecord);

module.exports = router;