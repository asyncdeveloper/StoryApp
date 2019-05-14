var express = require('express');
var router = express.Router();

var passport        = require('passport');
var csrf            = require('csurf') ;
var csrfProtection  = csrf({ cookie: true });
var loggedIn        = require('../middleware/loggedIn');
var notLoggedIn     = require('../middleware/notLoggedIn');
var Story			= require('../models/story');

router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res) {
	Story.find().sort({'createdAt': 'desc'}).find(function(err,stories){
		if(err) throw err;

		res.render('index', { 			
			title: 'Blog App' ,
			stories : stories
		});
	});
});

/* GET home page. */
router.get('/logout', loggedIn , function(req, res, next) {
    req.logout();
	res.redirect('/')
});

router.use(notLoggedIn);

/* GET login page. */
router.get('/login', function(req, res) {
    var messages = req.flash('error')
	res.render('home/login',{
		csrfToken : req.csrfToken() ,
		messages : messages,
		hasErrors : messages.length > 0
	});
});

/* POST login page. */
router.post('/login',passport.authenticate('local.login',{	
	failureRedirect : '/login',
	failureFlash : true
}),function(req,res){
	//Save slug from email to session
	var username = req.user.email;		
	req.session.slug = username.substring(0,username.indexOf('@'));	
	if(req.session.oldUrl){
		var oldUrl = req.session.oldUrl;
		req.session.oldUrl = null;
		res.redirect(oldUrl);		
	}else{
		res.redirect('/');
	}
});

/* GET register page. */
router.get('/register', function(req, res) {
    var messages = req.flash('error')
	res.render('home/register',{
		csrfToken : req.csrfToken() ,
		messages : messages,
        hasErrors : messages.length > 0
	});
});
    
/* POST register page. */
router.post('/register',passport.authenticate('local.register',{	
	failureRedirect : '/register',
	failureFlash : true
}),function(req,res){
	if(req.session.oldUrl){
		var oldUrl = req.session.oldUrl;
		req.session.oldUrl = null;
		res.redirect(oldUrl);		
	}else{
		res.redirect('/login');
	}
});

module.exports = router;