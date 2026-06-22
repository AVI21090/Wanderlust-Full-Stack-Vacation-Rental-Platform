const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    checkIn: {
        type: Date,
        required: true
    },

    checkOut: {
        type: Date,
        required: true
    },

    guests: {
        type: Number,
        required: true,
        min: 1
    },

    totalPrice: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        default: "Confirmed"
    },

    // ======================
    // PAYMENT DETAILS
    // ======================

    paymentId: {
        type: String,
        default: ""
    },

    orderId: {
        type: String,
        default: ""
    },

    paymentStatus: {
        type: String,
        default: "Pending"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "Booking",
    bookingSchema
);