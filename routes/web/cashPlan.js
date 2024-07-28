const express = require("express");
const router = express.Router();
const cashPlanController = require("../../controller/cashPlanController");

router.get("/", cashPlanController.index);

router.get("/create", cashPlanController.create);
router.post("/store", cashPlanController.store);
router.get("/:id", cashPlanController.show);

router.get("/:id/edit", cashPlanController.edit);
router.post("/:id/update", cashPlanController.update);
router.delete("/:id", cashPlanController.deleteRecord);

module.exports = router;