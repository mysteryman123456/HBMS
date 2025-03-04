const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/user-change-password", userController.changePassword);
router.post("/update-user-phonenumber", userController.updateUserPhoneNumber);
router.delete("/user-delete-account/:email", userController.deleteUserAccount);
router.get("/user-reservations/:phone", userController.getUserReservations);
router.post("/update-user-reservation", userController.updateUserReservation);

module.exports = router;