var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcryptjs');
var mysql = require('mysql2');
var connection = mysql.createConnection({
  host: 'db',
  user: 'root',
  password: 'shimahara',
  database: 'mydb'
});

/* GET home page. */
router.get('/', function(req, res, next) {
    const session = req.session.passport;
    if(session == null){
      res.redirect('/login');
    } 
    res.render('index');
});

router.get('/login', function(req, res, next){
  res.render('login');
});

router.post('/login', passport.authenticate('local', 
  {
    successRedirect: '/',
    failureRedirect: '/login',
    session: true,

  }));

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/add', function(req, res, next){
  res.render('add');
});


//ユーザー追加アクション
router.post('/add', function(req, res, next){
  var username = req.body.username;
  var password = req.body.password;
  var salt = bcrypt.genSaltSync(10);
  var hashed_password = bcrypt.hashSync(password, salt);
  connection.beginTransaction((err) => {
    if (err) { throw err; }
  
    connection.query('select * from users;', (error, users, fields) => {
      if (error) {
	return connection.rollback(() => {
	  throw error;
	});
      }
      connection.query('insert into users (username, password) values (?, ?);', [username, hashed_password], (error, users, fields) => {
	if (error) {
	  return connection.rollback(() => {
	    throw error;
	  });
	}
	connection.commit((err) => {
	  if (err) {
	    return connection.rollback(() => {
	      throw err;
	    });
	  }
	  console.log('user created!');
	});
      });
    });
  });
  res.redirect('/');
});

router.get('/vdl', function(req, res, next) {
  const session = req.session.passport;
    if(session == null){
        res.redirect('/login');
    } 
  var data = {
    output: null,
    errmsg: null
}
  res.render('vdl', data);
});

module.exports = router;
