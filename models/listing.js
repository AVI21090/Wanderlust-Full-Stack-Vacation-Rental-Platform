const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
  url:String,
  filename:String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.types.ObjectId,
      ref:"Review",
    },
  ],
  owner: {
    type: Schema.Types.objectId,
    ref:"user",
  } ,
  geometry : {
        type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

listingSchema.post("findOneAndDelete",async (Listing) => {
 if(listing) {
   await Review.deleteMany({_id : {$in: listing.reviews}}); 
 }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;