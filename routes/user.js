const express = require("express");

const passport = require("passport");

const router = express.Router();

const usersController = require("../Controllers/users");

const {

saveRedirectUrl,

LoggedIn

} = require("../middleware");

// ======================
// SIGNUP
// ======================

router

.route("/signup")

.get(

usersController.renderSignupForm

)

.post(

usersController.signup

);

// ======================
// LOGIN
// ======================

router

.route("/login")

.get(

usersController.renderLoginForm

)

.post(

saveRedirectUrl,

passport.authenticate(

"local",

{

failureRedirect:"/login",

failureFlash:true

}

),

usersController.login

);

// ======================
// PROFILE
// ======================

router.get(

"/profile",

LoggedIn,

usersController.profile

);

// ======================
// LOGOUT
// ======================

router.get(

"/logout",

usersController.logout

);

module.exports = router;