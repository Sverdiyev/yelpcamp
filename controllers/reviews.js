const Campground = require('../models/campgrounds');
const Review = require('../models/review');

let review = {};

review.delete = async (req, res) => {
  const { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  req.flash('success', 'Review Deleted!');
  res.redirect(`/campgrounds/${id}`);
};

review.create = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  const { review } = req.body;
  review.createdBy = req.user._id;
  const newReview = new Review(review);
  campground.reviews.push(newReview);
  await Promise.allSettled([newReview.save(), campground.save()]);
  req.flash('success', 'Review Created!');
  res.redirect(`/campgrounds/${id}`);
};

module.exports = review;
