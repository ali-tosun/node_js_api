const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const directorsRouter = require('./routes/directors');
const bodyParser = require('body-parser');


const app = express();
//db connection
const db = require('./helper/db')();

//middleware
const verifyToken = require('./middleware/verify-token');

//CONFİG
const config = require('./config');
app.set('api_secret_key',config.api_secret_key);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');



app.use(cookieParser());
app.use(logger('dev'));
app.use(express.json()); //body"locahost:8000"
app.use(express.urlencoded({ extended: true })); //body
app.use(express.static(path.join(__dirname, 'public')));
//app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/', indexRouter);
/*app.use('/api', function (req, res, next) {
  console.log("deneme1"+req.cookies['x-access-token']);
  console.log("deneme2"+req.cookies.ali);
  console.log("deneme2xx"+req('ali').Cookie);


  if (req.cookies['x-access-token']){
    req.headers['x-access-token'] = req.cookies['x-access-token'];
    next();
  }
  next();
});
kendi yazdığım.
*/


//app.use('/api',verifyToken); //api/slasından sonrası için.

app.use('/users', usersRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/directors', directorsRouter);

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
  res.json({error:{message:err.message,code:err.code}});
});

module.exports = app;
