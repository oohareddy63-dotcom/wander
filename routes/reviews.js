const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync");
const {
  isLoggedIn,
  validateReview,
  isReviewAuthor,
  canEditReviewOnce,
} = require("../middleware");

const reviewController = require("../controllers/reviews");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

router.get(
  "/:reviewId/edit",
  isLoggedIn,
  isReviewAuthor,
  canEditReviewOnce,
  wrapAsync(reviewController.renderEditReviewForm)
);

router.put(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  canEditReviewOnce,
  wrapAsync(reviewController.updateReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
