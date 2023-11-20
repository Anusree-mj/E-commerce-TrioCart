var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
var multer = require('multer');
var session = require('express-session')


//multer
const storage = multer.diskStorage({
  destination: ((req, file, cb) => {
    cb(null, './public/images/products');
  }),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});


var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var imageRouter = require('./routes/image');

var app = express();

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
