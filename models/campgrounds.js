const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const options = { toJSON: { virtuals: true } };

const ImageSchema = new Schema({ url: String, filename: String });

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload/', '/upload/w_200/');
});

ImageSchema.virtual('main').get(function () {
  return this.url.replace('/upload/', '/upload/q_100/h_400/');
});

const CampgroundSchema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, default: 'no description added' },
    city: { type: String, required: true },
    state: { type: String, required: true },
    geometry: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: { type: [Number], requried: true },
    },
    image: [ImageSchema],
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  options
);

CampgroundSchema.virtual('properties').get(function () {
  return {
    popUpText: `<a href = '/campgrounds/${this._id}'> ${this.title}</a>`,
  };
});

CampgroundSchema.post('findOneAndDelete', async (campground, next) => {
  if (campground) await Review.deleteMany({ _id: { $in: campground.reviews } });
  next();
});
const Campground = mongoose.model('Campground', CampgroundSchema);

module.exports = Campground;
