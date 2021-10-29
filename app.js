if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const express = require('express');
const path = require('path');
const ejs = require('ejs');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const MongoStore = require('connect-mongo');

const User = require('./models/user');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

const dbUrl = process.env.DB_URL;
// const dbURL = 'mongodb://localhost:27017/yelpCamp'

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  // crypto: {
  //   secret: 'squirrel',
  // },
});

const secret = process.env.SECRET || 'secret';
const sessionConfig = {
  store,
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const campgroundsRouter = require('./routes/campgrounds');
const reviewsRouter = require('./routes/reviews');
const userRouter = require('./routes/users');

mongoose
  .connect(dbUrl)
  .then(() => console.log('connected to Mongo!'))
  .catch((e) => console.error(e));
const { handleAsync, AppError } = require('./tools/utilities');

//flash
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.get('/', (req, res) => {
  res.render('home');
});
//routers
app.use('/', userRouter);
app.use('/campgrounds', campgroundsRouter);
app.use('/campgrounds/:id/reviews', reviewsRouter);

// error handling
app.all('*', (req, res) => {
  throw new AppError('Not found provided URL, please try searching again', 404);
});
// app.use((err, req, res, next) => {
//   const { status = 500 } = err;
//   if (!err.message) err.message = 'Something went wrong';
//   res.status(status);
//   res.render('error', { err });
// });

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`we are live on ${port}!`));
