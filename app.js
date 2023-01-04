var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars')
var sessions = require('express-session')
var nocache = require('nocache')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var adminRouter = require('./routes/admin');

var mongoose = require('mongoose');



//connect to db
mongoose.connect('mongodb://localhost:27017/user-app',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

mongoose.set("strictQuery", true);

var app = express();

//setting up session and cookie
const oneDay = 1000*60*60*24;
app.use(sessions({
  secret:'thisisthesecretkey',
  saveUninitialized:true,
  cookie:{maxAge:oneDay},
  resave:false,
}));

//no cache
app.use(nocache())

// view engine setup
app.set('views', [path.join(__dirname, 'views'),path.join(__dirname,'views/admin'),path.join(__dirname,'views/user')]);

app.engine('hbs',hbs.engine({
  extname:'hbs',
  defaultLayout:'layout',
  layoutsDir:__dirname+'/views/layouts',
  partialsDir:__dirname+'/views/partials/'}))

app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin',adminRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
