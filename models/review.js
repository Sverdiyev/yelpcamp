const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ReviewSchema = new Schema({
  rating: { type: Number, required: true, min: 0, max: 5 },
  body: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;

/wow