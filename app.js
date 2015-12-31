var express = require('express');
var favicon = require('serve-favicon');
var path    = require('path');

var routes = require('./routes/index');

var app = express();

// app.set('port', (process.env.PORT || 5000));

app.use(favicon(__dirname + '/favicon.ico'));

console.log("------  app file being read:");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// makes routes look in root directory
app.use(express.static(__dirname ));

// middlewear for routing requests
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// app.listen(app.get('port'), function() {
//   console.log('Node app is running on port', app.get('port'));
// });



module.exports = app;
