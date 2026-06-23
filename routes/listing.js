const express = require("express");

const router = express.Router();

const listingController = require("../Controllers/listing");

const {

LoggedIn,

isOwner,

validateListing,

} = require("../middleware");

// All Listings

router

.route("/")

.get(listingController.index)

.post(

LoggedIn,

validateListing,

listingController.createListing

);

// New Listing Form

router.get(

"/new",

LoggedIn,

listingController.renderNewForm

);

// AI SEARCH

router.get(

"/search",

listingController.aiSearch

);

// FILTERS

router.get(

"/filter/:type",

listingController.filterListings

);

// Single Listing

router

.route("/:id")

.get(listingController.showListing)

.put(

LoggedIn,

isOwner,

validateListing,

listingController.updateListing

)

.delete(

LoggedIn,

isOwner,

listingController.destroyListing

);

// Edit Form

router.get(

"/:id/edit",

LoggedIn,

isOwner,

listingController.renderEditForm

);

module.exports = router;
