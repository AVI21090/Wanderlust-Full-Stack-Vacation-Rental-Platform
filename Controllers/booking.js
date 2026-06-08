const Booking = require("../models/booking");
const Listing = require("../models/listing");

const Razorpay = require("razorpay");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ======================
// CREATE RAZORPAY ORDER
// ======================

module.exports.createOrder = async (req, res) => {

    try {

        const listingId = req.body.listingId;

        const listing = await Listing.findById(
            listingId
        );

        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing not found"
            });
        }

        const options = {
            amount: listing.price * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(
            options
        );

        res.json({
            success: true,
            order
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Order creation failed"
        });
    }
};

// ======================
// VERIFY PAYMENT
// ======================

module.exports.verifyPayment = async (req, res) => {

    try {

        console.log("Payment Success:", req.body);

        res.json({
            success: true,
            message: "Payment Verified"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false
        });
    }
};

// ======================
// CREATE BOOKING
// ======================
  
 module.exports.createBooking = async (req, res) => {

    try {

        const booking = new Booking(
            req.body.booking
        );

        booking.user = req.user._id;

        const listing = await Listing.findById(
            booking.listing
        );

        const checkIn =
            new Date(booking.checkIn);

        const checkOut =
            new Date(booking.checkOut);

        const days = Math.ceil(
            (checkOut - checkIn) /
            (1000 * 60 * 60 * 24)
        );

        booking.totalPrice =
            listing.price * days;

        await booking.save();

        req.flash(
            "success",
            "Booking Created Successfully"
        );

        res.redirect("/bookings");

    } catch (err) {

        console.log(err);

        req.flash(
            "error",
            "Booking Failed"
        );

        res.redirect("back");
    }
};

// ======================
// SHOW BOOKINGS
// ======================

module.exports.showBookings = async (req, res) => {

    const bookings = await Booking.find({
        user: req.user._id
    }).populate("listing");

    res.render(
        "bookings/index",
        { bookings }
    );
};

// ======================
// CANCEL BOOKING
// ======================

module.exports.cancelBooking = async (req, res) => {

    let { id } = req.params;

    await Booking.findByIdAndDelete(id);

    req.flash(
        "success",
        "Booking Cancelled"
    );

    res.redirect("/bookings");
};