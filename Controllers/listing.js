const Listing = require("../models/listing.js");

// INDEX (All Listings)
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

// SHOW (Single Listing)
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate("owner")
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    });

  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing });
};

// NEW FORM
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

// CREATE LISTING
module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);

  newListing.owner = req.user._id;

  await newListing.save();

  req.flash("success", "New Listing Created!");

  res.redirect("/listings");
};

// EDIT FORM
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/edit", { listing });
};

// UPDATE
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });

  req.flash("success", "Listing Updated!");

  res.redirect(`/listings/${id}`);
};

// DELETE
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;

  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing Deleted!");

  res.redirect("/listings");
};