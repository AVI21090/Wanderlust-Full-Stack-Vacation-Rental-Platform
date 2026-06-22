const User = require("../models/user");
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const Review = require("../models/review");

// ======================
// DASHBOARD
// ======================

module.exports.dashboard = async (req, res) => {

    const totalUsers = await User.countDocuments();
    const totalListings = await Listing.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalReviews = await Review.countDocuments();

    const revenueResult = await Booking.aggregate([
        {
            $group: {
                _id: null,
                totalRevenue: {
                    $sum: "$totalPrice"
                }
            }
        }
    ]);

    const totalRevenue =
        revenueResult.length > 0
            ? revenueResult[0].totalRevenue
            : 0;

    res.render("admin/dashboard", {
        totalUsers,
        totalListings,
        totalBookings,
        totalReviews,
        totalRevenue
    });
};

// ======================
// USERS
// ======================

module.exports.allUsers = async (req, res) => {

    const users = await User.find({});

    res.render("admin/users", { users });
};

module.exports.deleteUser = async (req, res) => {

    const { id } = req.params;

    await User.findByIdAndDelete(id);

    req.flash(
        "success",
        "User Deleted Successfully"
    );

    res.redirect("/admin/users");
};

// ======================
// LISTINGS
// ======================

module.exports.allListings = async (req, res) => {

    const listings = await Listing.find({})
        .populate("owner");

    res.render(
        "admin/listings",
        { listings }
    );
};

module.exports.deleteListing = async (req, res) => {

    const { id } = req.params;

    await Listing.findByIdAndDelete(id);

    req.flash(
        "success",
        "Listing Deleted Successfully"
    );

    res.redirect("/admin/listings");
};

// ======================
// BOOKINGS
// ======================

module.exports.allBookings = async (req, res) => {

    const bookings = await Booking.find({})
        .populate("user")
        .populate("listing");

    res.render(
        "admin/bookings",
        { bookings }
    );
};

module.exports.deleteBooking = async (req, res) => {

    const { id } = req.params;

    await Booking.findByIdAndDelete(id);

    req.flash(
        "success",
        "Booking Cancelled Successfully"
    );

    res.redirect("/admin/bookings");
};

// ======================
// REVIEWS
// ======================

module.exports.allReviews = async (req, res) => {

    const reviews = await Review.find({})
        .populate("author");

    res.render(
        "admin/reviews",
        { reviews }
    );
};

module.exports.deleteReview = async (req, res) => {

    const { id } = req.params;

    await Review.findByIdAndDelete(id);

    req.flash(
        "success",
        "Review Deleted Successfully"
    );

    res.redirect("/admin/reviews");
};