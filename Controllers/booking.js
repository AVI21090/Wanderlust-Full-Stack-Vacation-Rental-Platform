const Booking = require("../models/booking");
const Listing = require("../models/listing");

const Razorpay = require("razorpay");
const crypto = require("crypto");
const PDFDocument = require("pdfkit");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ======================
// CHECK AVAILABILITY
// ======================

module.exports.checkAvailability = async (req, res) => {

    try {

        const {
            listingId,
            checkIn,
            checkOut
        } = req.body;

        const existingBooking =
            await Booking.findOne({

                listing: listingId,

                checkIn: {
                    $lt: new Date(checkOut)
                },

                checkOut: {
                    $gt: new Date(checkIn)
                }

            });

        if (existingBooking) {

            return res.json({
                available: false,
                message:
                "Selected dates are already booked"
            });
        }

        res.json({
            available: true
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            available: false
        });
    }
};

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

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const body =
            razorpay_order_id +
            "|" +
            razorpay_payment_id;

        const expectedSignature =
            crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(body.toString())
            .digest("hex");

        if (
            expectedSignature ===
            razorpay_signature
        ) {

            console.log(
                "Payment Verified Successfully"
            );

            return res.json({
                success: true,
                message:
                "Payment Verified Successfully"
            });
        }

        console.log(
            "Invalid Razorpay Signature"
        );

        return res.status(400).json({
            success: false,
            message:
            "Invalid Payment Signature"
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

        if (!listing) {

            req.flash(
                "error",
                "Listing not found"
            );

            return res.redirect("back");
        }

        const checkIn =
            new Date(booking.checkIn);

        const checkOut =
            new Date(booking.checkOut);

        if (checkOut <= checkIn) {

            req.flash(
                "error",
                "Check-Out date must be after Check-In date"
            );

            return res.redirect("back");
        }

        const existingBooking =
            await Booking.findOne({

                listing: booking.listing,

                checkIn: {
                    $lt: checkOut
                },

                checkOut: {
                    $gt: checkIn
                }

            });

        if (existingBooking) {

            req.flash(
                "error",
                "Selected dates are already booked"
            );

            return res.redirect("back");
        }
const days = Math.ceil(
    (checkOut - checkIn) /
    (1000 * 60 * 60 * 24)
);

booking.totalPrice =
    listing.price * days;

// ======================
// PAYMENT DETAILS
// ======================

booking.paymentId =
    req.body.booking.paymentId || "";

booking.orderId =
    req.body.booking.orderId || "";

booking.paymentStatus =
    req.body.booking.paymentStatus || "Pending";

// SAVE BOOKING
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

// ======================
// DOWNLOAD INVOICE PDF
// ======================

module.exports.downloadInvoice = async (req, res) => {

    try {

        const { id } = req.params;

        const booking = await Booking.findById(id)
            .populate("listing")
            .populate("user");

        if (!booking) {

            req.flash(
                "error",
                "Booking not found"
            );

            return res.redirect("/bookings");
        }

        const doc = new PDFDocument();

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=invoice-${booking._id}.pdf`
        );

        doc.pipe(res);

        doc
            .fontSize(24)
            .text(
                "WanderLust Invoice",
                {
                    align: "center"
                }
            );

        doc.moveDown();

        doc.fontSize(14);

        doc.text(`Invoice ID: ${booking._id}`);

        doc.text(
            `Property: ${booking.listing.title}`
        );

        doc.text(
            `Location: ${booking.listing.location}`
        );

        doc.text(
            `Guest: ${booking.user.username}`
        );

        doc.text(
            `Check-In: ${booking.checkIn.toDateString()}`
        );

        doc.text(
            `Check-Out: ${booking.checkOut.toDateString()}`
        );

        doc.text(
            `Guests: ${booking.guests}`
        );

        doc.text(
            `Payment Status: ${booking.paymentStatus}`
        );

    doc.text(
    `Total Amount: Rs. ${booking.totalPrice}`
);

doc.moveDown();

doc.text(
    "Thank you for booking with WanderLust"
);

        doc.end();

    } catch (err) {

        console.log(err);

        req.flash(
            "error",
            "Invoice Generation Failed"
        );

        res.redirect("/bookings");
    }
};