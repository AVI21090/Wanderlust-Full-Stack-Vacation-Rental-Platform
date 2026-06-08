const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/booking");

const {
    LoggedIn,
    validateBooking,
} = require("../middleware");

// Show all bookings
router.get(
    "/",
    LoggedIn,
    bookingController.showBookings
);

// Create Razorpay Order
router.post(
    "/create-order",
    LoggedIn,
    bookingController.createOrder
);

// Verify Payment
router.post(
    "/verify-payment",
    LoggedIn,
    bookingController.verifyPayment
);

// Create booking
router.post(
    "/new",
    LoggedIn,
    validateBooking,
    bookingController.createBooking
);

// Cancel booking
router.delete(
    "/:id",
    LoggedIn,
    bookingController.cancelBooking
);

module.exports = router;