const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')  // for uploading file 
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage })

router
  .route("/")
  .get(wrapAsync(listingController.index)) // Index Route
  .post(
    isLoggedIn,
    upload.single('listing[image][url]'),
    validateListing,
    wrapAsync(listingController.createListing)
  ); // Create Route (Db)

  // New Route
  router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing)) // Show Route
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image][url]'),
    validateListing,
    wrapAsync(listingController.updateListing)
  ); // Update Route (Db)


// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

// Delete Listings
router.delete(
  "/:id/delete",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);

module.exports = router;
