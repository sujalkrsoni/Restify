const Review = require('../models/review.js');
const Listings = require('../models/listing.js');

module.exports.createReview = async (req,res) =>{
    let listing = await Listings.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review Added!")
    res.redirect(`/listings/${req.params.id}`)
}

module.exports.destroyReview =  async (req,res)=>{
    let { id , reviewId} = req.params;
    await Listings.findByIdAndUpdate(id , {$pull : {reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!")
    res.redirect(`/listings/${id}`)
}