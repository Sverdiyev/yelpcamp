const Campground = require('./models/campgrounds');
const Review = require('./models/review');
const {
  campgroundValidationSchema,
  reviewValidationSchema,
} = require('./tools/validationSchemas');

module.exports.isLoggedIn = function (req, res, next) {
  if (!req.isAuthenticated()) {
    console.log(' Original URL for IS Logged In is :' + req.originalUrl);
    req.flash('error', 'You need to be logged in');
    req.session.redirectTo = req.originalUrl;
    return res.redirect('/login');
  }
  next();
};

module.exports.isAuthor = async function (req, res, next) {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.createdBy.equals(req.user._id)) {
    req.flash('error', 'not creted by you');
    return res.redirect('/campgrounds');
  }
  next();
};

module.exports.isReviewAuthor = async function (req, res, next) {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.createdBy.equals(req.user._id)) {
    req.flash('error', 'not your review. cannot delete');
    return res.redirect(req.header('Referer'));
  }
  next();
};

//joi campground
module.exports.validateCampground = function (req, res, next) {
  const { campground } = req.body;
  const { error } = campgroundValidationSchema.validate(campground);
  if (error) {
    const messages = error.details.map((e) => e.message).join(', ');
    req.flash('error', messages);
    const previousURL = req.header('Referer');
    return res.redirect(previousURL);
  }
  next();
};

//joi review
module.exports.validateReview = function (req, res, next) {
  const { review } = req.body;
  const { error } = reviewValidationSchema.validate(review);
  if (error) {
    const messages = error.details.map((e) => e.message).join(', ');
    throw new AppError(messages, 400);
  }
  next();
};
