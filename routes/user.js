const express = require("express");
const passport = require("passport");

const router = express.Router();

const usersController = require("../controllers/users");
const { saveRedirectUrl } = require("../middleware");

router
  .route("/signup")
  .get(usersController.renderSignupForm)
  .post(usersController.signup);

router
  .route("/login")
  .get(usersController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    usersController.login
  );

router.get("/logout", usersController.logout);

module.exports = router;