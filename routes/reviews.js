const express = require('express');
const router = express.Router({ mergeParams: true });
const { handleAsync } = require('../tools/utilities');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');
const review = require('../controllers/reviews');

router.post('/', isLoggedIn, validateReview, handleAsync(review.create));

router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  handleAsync(review.delete)
);

module.exports = router;
