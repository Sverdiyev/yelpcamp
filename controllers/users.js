const User = require('../models/user');

let user = {};

user.renderRegister = (req, res) => {
  res.render('users/register');
};

user.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const newUser = await User.register({ username, email }, password);
    req.flash('success', 'User Registered! Welcome!');
    req.login(newUser, (err) => {
      if (err) return next(err);
      res.redirect('/campgrounds');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/register');
  }
};

user.renderLogin = (req, res) => {
  console.log(req.session.redirectTo);
  if (req.header('Referer') && !req.session.redirectTo)
    req.session.redirectTo = req.header('Referer');
  console.log(req.session.redirectTo);
  res.render('users/login');
};

user.login = (req, res) => {
  console.log(req.session.redirectTo);
  const redirectTo = req.session.redirectTo || '/campgrounds';
  delete req.session.redirectTo;
  res.redirect(redirectTo);
};

user.logout = (req, res) => {
  req.flash('success', 'Goodbye!');
  req.logout();
  res.redirect('/campgrounds');
};
module.exports = user;
