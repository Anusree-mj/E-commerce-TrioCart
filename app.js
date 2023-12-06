const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const multer = require('multer');
const session = require('express-session')
const Razorpay = require('razorpay');

//multer
const storage = multer.diskStorage({
  destination: ((req, file, cb) => {
    cb(null, './public/images/products');
  }),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// razorpay
const instance = new Razorpay({
  key_id: 'rzp_test_mj8FaMjD2VYPW4',
  key_secret: 'bJeiO2GMbp3vvqfvPzwNQUaC',
});

const usersRouter = require('./routes/customer');
const adminRouter = require('./routes/admin');
const imageRouter = require('./routes/admin/image');
const productRouter = require('./routes/customer/products');
const userLoginRouter = require('./routes/customer/userLogins');
const searchRouter = require('./routes/customer/search');

const app = express();

const upload = multer({ storage: storage });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layout/layout');


app.use(expressLayouts);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

//session
app.use(session({
  secret: 'Key',
  cookie: { maxAge: 604800000 },
  resave: true,
  saveUninitialized: true
}))
app.use((req, res, next) => {
  res.header('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  next();
});

app.use('/', usersRouter);
app.use('/admin', adminRouter);
app.use('/image', imageRouter);
app.use('/products', productRouter);
app.use('/user', userLoginRouter);
app.use('/search', searchRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
