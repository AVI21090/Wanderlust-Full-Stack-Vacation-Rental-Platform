const User = require("../models/user");
const Listing = require("../models/listing");

// Add to Wishlist
module.exports.addToWishlist = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(req.user._id);

  if (!user.wishlist.includes(id)) {
    user.wishlist.push(id);
    await user.save();
  }

  req.flash(
    "success",
    "Added to Wishlist ❤️"
  );

  res.redirect(`/listings/${id}`);
};

// Remove from Wishlist
module.exports.removeFromWishlist = async (req, res) => {
  const { id } = req.params;

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: {
        wishlist: id,
      },
    }
  );

  req.flash(
    "success",
    "Removed from Wishlist"
  );

  res.redirect(`/listings/${id}`);
};

// Show Wishlist
module.exports.showWishlist = async (req, res) => {

  const user = await User.findById(
    req.user._id
  ).populate("wishlist");

  res.render(
    "wishlist/index",
    {
      allListings: user.wishlist,
    }
  );
};