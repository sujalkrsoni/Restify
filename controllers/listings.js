const Listings = require('../models/listing.js');


module.exports.index = async (req, res) => {
    const allListing = await Listings.find({});
    res.render("listings/index.ejs", { allListing });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listings.findById(id)
      .populate({path :"reviews", populate : {path : "author"}})
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing Doesn't Exists!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listings(req.body.listing);
    console.log(req.user);
    newListing.owner = req.user._id; // passport store user information by default, in user object, and user has their user id .that id we have to store in our listing owner object
    newListing.image = { url , filename }
    await newListing.save();
    req.flash("success", "New Listing created!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listings.findById(id);
    if (!listing) {
      req.flash("error", "Listing Doesn't Exists!");
      res.redirect("/listings");
    }
    let originalImage = listing.image.url;
    originalImage = originalImage.replace("/upload", "/upload/w_250")
    res.render("listings/edit.ejs", { listing, originalImage });
}

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    let listing = await Listings.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url , filename}
        await listing.save();
    }

    req.flash("success", "Successfully Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listings.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Successfully Delete!");
    res.redirect("/listings");
}