const express = require("express");
const router = express.Router();
const usersController = require("../../controller/usersController");

router.get("/", usersController.index);

router.get("/create", usersController.create);
router.post("/store", usersController.store);
router.get("/:id", usersController.show);

router.get("/:id/edit", usersController.edit);
router.post("/:id/update", usersController.update);
router.delete("/:id", usersController.deleteRecord);
router.put("/status/:id", usersController.changeStatus);

module.exports = router;