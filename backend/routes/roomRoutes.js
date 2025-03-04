const express = require("express");
const roomController = require("../controllers/roomController");
const router = express.Router();

router.post("/add-room", roomController.addRoom);
router.put("/update-room", roomController.updateRoom);
router.delete("/delete-room/:hotel_id", roomController.deleteRoom);

module.exports = router;