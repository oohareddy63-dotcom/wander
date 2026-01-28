const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  const review = new Review(req.body.review);
  review.author = req.user._id;

  listing.reviews.push(review);

  await review.save();
  await listing.save();

  req.flash("success", "Review added!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.renderEditReviewForm = async (req, res) => {
  const { id, reviewId } = req.params;

  const listing = await Listing.findById(id);
  const review = await Review.findById(reviewId);

  if (!listing || !review) {
    req.flash("error", "Listing or review not found");
    return res.redirect("/listings");
  }

  res.render("reviews/edit", { 
    listing, 
    review,
    success: res.locals.success || [],
    error: res.locals.error || [],
    currentUser: res.locals.currentUser || null,
  });
};

module.exports.updateReview = async (req, res) => {
  const { id, reviewId } = req.params;

  const review = await Review.findByIdAndUpdate(
    reviewId,
    {
      ...req.body.review,
      hasBeenEdited: true,
    },
    { new: true }
  );

  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }

  req.flash("success", "Review updated (can only be edited once)");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });

  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review deleted!");
  res.redirect(`/listings/${id}`);
};
