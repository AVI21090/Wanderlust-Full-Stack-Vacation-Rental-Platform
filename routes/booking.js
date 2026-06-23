const express = require("express");
const router = express.Router();

const bookingController = require("../Controllers/booking");

const {
    LoggedIn,
    validateBooking,
} = require("../middleware");

// ======================
// SHOW BOOKINGS
// ======================

router.get(
    "/",
    LoggedIn,
    bookingController.showBookings
);

// ======================
// CHECK AVAILABILITY
// ======================

router.post(
    "/check-availability",
    LoggedIn,
    bookingController.checkAvailability
);

// ======================
// CREATE RAZORPAY ORDER
// ======================

router.post(
    "/create-order",
    LoggedIn,
    bookingController.createOrder
);

// ======================
// VERIFY PAYMENT
// ======================

router.post(
    "/verify-payment",
    LoggedIn,
    bookingController.verifyPayment
);

// ======================
// CREATE BOOKING
// ======================

router.post(
    "/new",
    LoggedIn,
    validateBooking,
    bookingController.createBooking
);

// ======================
// DOWNLOAD INVOICE
// ======================

router.get(
    "/invoice/:id",
    LoggedIn,
    bookingController.downloadInvoice
);

// ======================
// CANCEL BOOKING
// ======================

router.delete(
    "/:id",
    LoggedIn,
    bookingController.cancelBooking
);

module.exports = router;