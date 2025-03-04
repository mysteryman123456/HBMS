const express = require("express");
const hotelController = require("../controllers/hotelController");
const { upload } = require("../config/cloudinary");

const router = express.Router();

router.post("/add-hotel", upload.array("images"), hotelController.addHotel);
router.post("/fetch-hotel-edit", hotelController.fetchHotelEdit);
router.put("/update-listing", hotelController.updateListing);
router.delete("/delete-listing", hotelController.deleteListing);
router.get("/get-hotel-location-name", hotelController.getHotelLocationAndName);
router.get("/get-hotel-listing/:id", hotelController.getHotelListing);
router.get("/get-allhotel-listing", hotelController.getALLHotelListing);

router.get("/get-searched-listing", hotelController.getSearchedListing);

module.exports = router;