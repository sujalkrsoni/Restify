const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : String,
    image: {
        filename: String,  // String field for the filename
        url: {
          type: String,  // String field for the URL
          default: "https://img.freepik.com/free-photo/beautiful-tropical-beach-sea-ocean-with-coconut-palm-tree-sunrise-time_74190-7454.jpg?t=st=1728326955~exp=1728330555~hmac=240b9fd4f0a33ef319f1296a7bd64bea68247b8c8ad936587c2087e1948a72d3&w=900",
          set: (v) => {
            return v === "" 
              ? "https://img.freepik.com/free-photo/beautiful-tropical-beach-sea-ocean-with-coconut-palm-tree-sunrise-time_74190-7454.jpg?t=st=1728326955~exp=1728330555~hmac=240b9fd4f0a33ef319f1296a7bd64bea68247b8c8ad936587c2087e1948a72d3&w=900"
              : v;
          }
        }
    },            
    price : Number,
    location : String, 
    country : String,
    reviews : [
      {
        type : Schema.Types.ObjectId,
        ref : "Review",
      },
    ],
    owner : {
      type : Schema.Types.ObjectId,
      ref : "User"
    }
});


listingSchema.post("findOneAndDelete", async (listing) =>{
  if(listing){
    await Review.deleteMany({ _id : {$in : listing.reviews} });
  }
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;