var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2');
var bcrypt = require('bcrypt');
var passport = require('passport');
var config = require('./config');
var session = require('express-session');

var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  database: 'mydb'
});

//追加オブジェクト
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var session = require('express-session');

//vdl用
var exec = require('child_process').exec;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var vdlRouter = require('./routes/vdl');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//セッション情報
var session_data = {
  secret: 'password test',
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 5*1000}
};

app.use(session(session_data));

//twitter認証
app.use(passport.initialize());
app.use(passport.session());
passport.use(new TwitterStrategy({
  consumerKey: config.consumerKey,
  consumerSecret: config.consumerSecret,
  callbackURL: config.callbackURL
},
  function(token, tokenSecret, profile, done){
    //ここにユーザー追加のクエリを書く
    console.log(profile);
    return done(null, profile);
  }
));

passport.serializeUser(function(username, done){
  done(null, username);
});
passport.deserializeUser(function(username, done){
  done(null, username);
});

//認証機構
app.use(passport.initialize());
app.use(passport.session());
var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy({
  usernameField: 'username',
  password: 'password',
  session: false,
}, 
function(username, password, done){
  connection.query("select * from users;", function(err, users){
    var usernames = [];
    var passwords = [];
    var flag = false;
    for(var i=0; i < users.length; i++){
      usernames.push(users[i].username);
      var pw = users[i].password.toString();
      passwords.push(pw);
      if(bcrypt.compareSync(password.toString(), pw)){
        flag=true;
        break;
      }
    }
    if( usernames.includes(username) && flag) {
      return done(null, username);
    } 
    return done(null, false, {message: 'パスワードが正しくありません。'});
  });
}

));

passport.serializeUser(function(username, done){
  done(null, username);
});

passport.deserializeUser(function(username, done){
  done(null, username);
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/vdl', vdlRouter);
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' 
}));

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
