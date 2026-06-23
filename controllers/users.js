const User = require("../models/user");
const Booking = require("../models/booking");
const Listing = require("../models/listing");

// ======================
// SIGNUP FORM
// ======================

module.exports.renderSignupForm = (req, res) => {

  res.render("users/signup.ejs");

};

// ======================
// SIGNUP
// ======================

module.exports.signup = async (req, res, next) => {

  try {

    const {

      username,

      email,

      password

    } = req.body;

    const newUser = new User({

      email,

      username

    });

    const registeredUser = await User.register(

      newUser,

      password

    );

    req.login(

      registeredUser,

      (err) => {

        if (err) {

          return next(err);

        }

        req.flash(

          "success",

          "Welcome to Wanderlust!"

        );

        res.redirect("/listings");

      }

    );

  }

  catch (e) {

    req.flash(

      "error",

      e.message

    );

    res.redirect("/signup");

  }

};

// ======================
// LOGIN FORM
// ======================

module.exports.renderLoginForm = (req, res) => {

  res.render("users/login.ejs");

};

// ======================
// LOGIN
// ======================

module.exports.login = async (req, res) => {

  req.flash(

    "success",

    "Welcome back to Wanderlust!"

  );

  let redirectUrl =

    res.locals.redirectUrl ||

    "/listings";

  res.redirect(

    redirectUrl

  );

};

// ======================
// PROFILE
// ======================

module.exports.profile = async (req, res) => {

  const user = await User.findById(

    req.user._id

  ).populate("wishlist");

  const myBookings =

    await Booking.countDocuments({

      user: req.user._id

    });

  const myListings =

    await Listing.countDocuments({

      owner: req.user._id

    });

  res.render(

    "users/profile",

    {

      user,

      myBookings,

      myListings

    }

  );

};

// ======================
// LOGOUT
// ======================

module.exports.logout = (req, res, next) => {

  req.logout((err) => {

    if (err) {

      return next(err);

    }

    req.flash(

      "success",

      "You are logged out!"

    );

    res.redirect("/listings");

  });

};