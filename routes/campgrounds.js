const express = require('express');
const router = express.Router();
const { handleAsync } = require('../tools/utilities');
const Campground = require('../models/campgrounds');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campground = require('../controllers/campgrounds');
const multer = require('multer');
const { storage, cloudinary } = require('../cloudinary/index');

const upload = multer({ storage });

router
  .route('/')
  .get(handleAsync(campground.index))
  .post(
    isLoggedIn,
    upload.array('image', 12),
    validateCampground,
    handleAsync(campground.createCampground)
  );

router.get('/new', isLoggedIn, campground.renderNewPage);

router
  .route('/:id')
  .get(handleAsync(campground.renderShowPage))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array('image', 12),
    validateCampground,
    handleAsync(campground.editCampground)
  )
  .delete(isLoggedIn, isAuthor, handleAsync(campground.deleteCampground));

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  handleAsync(campground.renderEditPage)
);

module.exports = router;
