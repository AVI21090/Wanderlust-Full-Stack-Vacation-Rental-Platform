const Joi = require("joi");

// LISTING VALIDATION
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),

    description: Joi.string().required(),

    location: Joi.string().required(),

    country: Joi.string().required(),

    price: Joi.number().required().min(0),

    image: Joi.string().allow("", null),

  }).required(),
});

// REVIEW VALIDATION
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),

    comment: Joi.string().required(),
  }).required(),
});

// BOOKING VALIDATION
module.exports.bookingSchema = Joi.object({
  booking: Joi.object({

    listing: Joi.string().required(),

    checkIn: Joi.date().required(),

    checkOut: Joi.date().required(),

    guests: Joi.number()
      .min(1)
      .required(),

    paymentId: Joi.string()
      .allow("", null),

    orderId: Joi.string()
      .allow("", null),

    paymentStatus: Joi.string()
      .allow("", null)

  }).required(),
});