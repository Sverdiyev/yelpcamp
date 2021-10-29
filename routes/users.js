const express = require('express');
const passport = require('passport');
const { handleAsync } = require('../tools/utilities');
const user = require('../controllers/users');

const passportConfig = {
  failureRedirect: '/login',
  failureFlash: true,
  successFlash: 'Logged In',
};

const router = express.Router({ mergeParams: true });

router
  .route('/register')
  .get(user.renderRegister)
  .post(handleAsync(user.register));

router
  .route('/login')
  .get(user.renderLogin)
  .post(passport.authenticate('local', passportConfig), user.login);

router.get('/logout', user.logout);

module.exports = router;
