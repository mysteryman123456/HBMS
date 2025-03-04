const express = require("express");
const reservationController = require("../controllers/reservationController");
const router = express.Router();

router.post("/add-reservation", reservationController.addReservation);
router.delete("/delete-reservation/:reservation_id", reservationController.deleteReservation);
router.get("/reservations/:seller_email", reservationController.fetchReservations);
router.delete("/admin-delete-reservation/:reservation_id", reservationController.adminDeleteReservation);
router.delete("/user-delete-reservation/:reservation_id", reservationController.userDeleteReservation);

module.exports = router;