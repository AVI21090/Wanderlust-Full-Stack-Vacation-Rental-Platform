const express = require("express");
const router = express.router();
const wrapAsync = require("../utils/WrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");


const listingcontroller = require("../controllers/listings.js")
const multer  = require('multer')
const {storage}= require("../cloudConfig.js");
const upload = multer({ storage }) 

router.route("/")
  .get(wrapAsync(listingcontroller.index))
  .post(
    isLoggedIn,

    upload.single('listing[image]'),
        validateListing,
    wrapAsync(listingcontroller.createLisitng)
  );
 
//New Route
router.get("/new", isLoggedIn, listingcontroller.renderNewForm);

router.route("/:id")
  .get(wrapAsync(listingcontroller.showListing))
  .put(
    isLoggedIn,
    isOwner, 
    upload.single('listing[image]'), 
    validateListing,
    wrapAsync(listingcontroller.updateListing))

  .delete(isLoggedIn, isOwner, wrapAsync(listingcontroller.destroyListing));


//Edit Route
router.get("/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingcontroller.renderEdit.Form)
);



module.exports = router;