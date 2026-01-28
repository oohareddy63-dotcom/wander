const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  category: {
    type: String,
    enum: [
      "trending",
      "beach",
      "rooms",
      "iconic-cities",
      "mountains",
      "castles",
      "amazing-pools",
      "camping",
      "farms",
      "arctic",
      "domes",
      "boats",
    ],
    default: "trending",
  },

  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default:
        "https://via.placeholder.com/300x200?text=No+Image",
    },
  },

  price: Number,
  location: String,
  country: String,

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner : {
    type : Schema.Types.ObjectId,
    ref : "User",
  },

  geometry: {
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
},

}); 

listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing && listing.reviews.length) {
    await Review.deleteMany({
      _id: { $in: listing.reviews },
    });
  }
});

module.exports = mongoose.model("Listing", listingSchema);
