const Listing = require("./models/listing");
const Review = require("./models/review");

const {
    listingSchema,
    reviewSchema,
    bookingSchema,
} = require("./schema.js");

const ExpressError = require("./utils/ExpressError.js");


// LOGIN CHECK
module.exports.LoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {

        req.session.redirectUrl = req.originalUrl;

        req.flash(
            "error",
            "You must be logged in!"
        );

        return res.redirect("/login");
    }

    next();
};


// SAVE REDIRECT URL
module.exports.saveRedirectUrl = (req, res, next) => {

    if (req.session.redirectUrl) {

        res.locals.redirectUrl =
            req.session.redirectUrl;

        delete req.session.redirectUrl;
    }

    next();
};


// OWNER CHECK
module.exports.isOwner = async (
    req,
    res,
    next
) => {

    let { id } = req.params;

    let listing =
        await Listing.findById(id);

    if (!listing) {

        req.flash(
            "error",
            "Listing not found!"
        );

        return res.redirect("/listings");
    }

    if (!listing.owner.equals(req.user._id)) {

        req.flash(
            "error",
            "You are not the owner of this listing!"
        );

        return res.redirect(
            `/listings/${id}`
        );
    }

    next();
};


// VALIDATE LISTING
module.exports.validateListing = (
    req,
    res,
    next
) => {

    let { error } =
        listingSchema.validate(req.body);

    if (error) {

        let errMsg =
            error.details
                .map((el) => el.message)
                .join(", ");

        throw new ExpressError(
            400,
            errMsg
        );
    }

    next();
};


// VALIDATE REVIEW
module.exports.validateReview = (
    req,
    res,
    next
) => {

    let { error } =
        reviewSchema.validate(req.body);

    if (error) {

        let errMsg =
            error.details
                .map((el) => el.message)
                .join(", ");

        throw new ExpressError(
            400,
            errMsg
        );
    }

    next();
};


// VALIDATE BOOKING
module.exports.validateBooking = (
    req,
    res,
    next
) => {

    let { error } =
        bookingSchema.validate(req.body);

    if (error) {

        let errMsg =
            error.details
                .map((el) => el.message)
                .join(", ");

        throw new ExpressError(
            400,
            errMsg
        );
    }

    next();
};


// REVIEW AUTHOR CHECK
module.exports.isReviewAuthor = async (
    req,
    res,
    next
) => {

    let { id, reviewId } = req.params;

    let review =
        await Review.findById(reviewId);

    if (!review) {

        req.flash(
            "error",
            "Review not found!"
        );

        return res.redirect(
            `/listings/${id}`
        );
    }

    if (
        !review.author.equals(req.user._id)
    ) {

        req.flash(
            "error",
            "You are not the author of this review!"
        );

        return res.redirect(
            `/listings/${id}`
        );
    }

    next();
};

// ADMIN CHECK
module.exports.isAdmin = (req, res, next) => {

    if (!req.user || !req.user.isAdmin) {

        req.flash(
            "error",
            "You are not authorized to access Admin Dashboard!"
        );

        return res.redirect("/listings");
    }

    next();
};