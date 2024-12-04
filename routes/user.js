const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");



router
  .route("/signup")
  .get(userController.renderSignupForm) // For Showing signup Form
  .post(wrapAsync(userController.signup)); // for upadating data to db

router
  .route("/login")
  .get(userController.renderLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate(
      "local", // passport authenticate middleware
      {
        failureRedirect: "/login",
        failureFlash: true,
      }
    ),
    wrapAsync(userController.login)
  );

router.get("/logout", userController.logout);

module.exports = router;
