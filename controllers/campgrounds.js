const Campground = require('../models/campgrounds');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

let campground = {};

campground.index = async (req, res, next) => {
  const campgrounds = await Campground.find();
  res.render('campgrounds/index', { campgrounds });
};

campground.renderNewPage = (req, res) => {
  res.render('campgrounds/new');
};

campground.renderShowPage = async (req, res, next) => {
  const { id } = req.params;
  let campground = undefined;
  try {
    campground = await Campground.findById(id)
      .populate('reviews')
      .populate({ path: 'reviews', populate: { path: 'createdBy' } })
      .populate('createdBy');
  } catch (e) {
    req.flash('error', 'Campground not found.');
    return res.redirect('/campgrounds');
  }
  if (!campground) {
    req.flash('error', 'Campground not found.');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground });
};

campground.renderEditPage = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash('error', 'Campground not found.');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground });
};

campground.createCampground = async (req, res, next) => {
  const { campground } = req.body;
  const location = await geocoder
    .forwardGeocode({
      query: campground.city + ', ' + campground.state,
      limit: 1,
    })
    .send();
  campground.geometry = location.body.features[0].geometry;
  campground.createdBy = req.user._id;
  campground.image = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  const newCampground = new Campground(campground);
  const { _id } = await newCampground.save();
  req.flash('success', 'Successfully Created Campground');
  res.redirect(`campgrounds/${_id}`);
};

campground.editCampground = async (req, res, next) => {
  console.log(req.body, req.files);
  const { id } = req.params;
  const { deletedImages, campground } = req.body;
  const newCampground = await Campground.findByIdAndUpdate(id, campground);

  newCampground.image.push(
    ...req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }))
  );

  if (deletedImages?.length) {
    await newCampground.updateOne({
      $pull: { image: { filename: { $in: deletedImages } } },
    });
    for (let img of deletedImages) {
      await cloudinary.uploader.destroy(img);
    }
  }
  await newCampground.save();
  req.flash('success', 'Successfully Updated Campground');
  res.redirect(`/campgrounds/${id}`);
};

campground.deleteCampground = async (req, res, next) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Campground Deleted!');
  res.redirect('/campgrounds');
};

module.exports = campground;
