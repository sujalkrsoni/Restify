const express = require('express'); // for router
const router = express.Router({mergeParams : true});
const wrapAsync = require('../utils/wrapAsync.js');
const {isLoggedIn, isReviewOwner, validateReview} = require('../middleware.js');
const reviewController = require('../controllers/review.js');

// Reviews 
// Review(Post) Route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview))

// Review delete Route 
router.delete("/:reviewId",isLoggedIn,isReviewOwner, wrapAsync(reviewController.destroyReview))

module.exports = router;
