const express = require("express");
const router = express.Router();

const { LoggedIn, isAdmin } = require("../middleware");

const adminController = require("../controllers/admin");

// Dashboard
router.get(
    "/",
    LoggedIn,
    isAdmin,
    adminController.dashboard
);

// =====================
// USERS
// =====================

router.get(
    "/users",
    LoggedIn,
    isAdmin,
    adminController.allUsers
);

router.delete(
    "/users/:id",
    LoggedIn,
    isAdmin,
    adminController.deleteUser
);

// =====================
// LISTINGS
// =====================

router.get(
    "/listings",
    LoggedIn,
    isAdmin,
    adminController.allListings
);

router.delete(
    "/listings/:id",
    LoggedIn,
    isAdmin,
    adminController.deleteListing
);

// =====================
// BOOKINGS
// =====================

router.get(
    "/bookings",
    LoggedIn,
    isAdmin,
    adminController.allBookings
);

router.delete(
    "/bookings/:id",
    LoggedIn,
    isAdmin,
    adminController.deleteBooking
);

// =====================
// REVIEWS
// =====================

router.get(
    "/reviews",
    LoggedIn,
    isAdmin,
    adminController.allReviews
);

router.delete(
    "/reviews/:id",
    LoggedIn,
    isAdmin,
    adminController.deleteReview
);

module.exports = router;