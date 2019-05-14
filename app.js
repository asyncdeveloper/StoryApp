var path         = require('path');
var createError  = require('http-errors');
var express      = require('express');
var session      = require('express-session');
var cookieParser = require('cookie-parser');
var logger       = require('morgan');
var expressHbs   = require('express-handlebars');
var mongoose     = require('mongoose');
var passport     = require('passport');
var flash        = require('connect-flash');
var validator    = require('express-validator');
var MongoStore   = require('connect-mongo')(session);
var moment		 = require('moment');

var indexRouter    = require('./routes/index');
var categoryRouter = require('./routes/category');
var storyRouter    = require('./routes/story');
var commentRouter  = require('./routes/comment');

var app = express();
var dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/blogapp' ;
var sessionSecret = process.env.SESSION_SECRET || 'mysupersecret';

mongoose.connect(dbUrl, { useNewUrlParser: true })
    .then( () => console.log(`Connected to ${dbUrl}...`))
    .catch(err => console.error(`Could not connect to ${dbUrl}... ${err}`));

require('./config/passport');

// view engine setup
app.engine('.hbs', expressHbs({
	defaultLayout: 'layout',
	extname: '.hbs',
	helpers : {
		excerpt : function(string){ 
			if(string.length>100)
				return string.substring(0,100) + ' . . . ';
			else
				return string;
		},
		isEqual : function(category1,category2){			
			if(category1 === category2) 
				return ' selected';
		},
		formatDate : function(dateTime) {
			var timestamp = moment(dateTime);						
			return timestamp.format('LLLL');
		},
		makeVisible : function(commentUser,loggedInUser,options){
			return commentUser === loggedInUser ? options.fn(this) : options.inverse(this);				
		}
	},
    partialsDir: [
        __dirname + 'views/partials/'
    ]
}));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
	secret : sessionSecret,
	resave : false,
	saveUninitialized : false,
	store : new MongoStore({
		mongooseConnection : mongoose.connection
	}),
	cookie : {
		maxAge : 180 * 60 * 1000 
	}       
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next) {
	res.locals.login = req.isAuthenticated();
	res.locals.session = req.session;		
	next();
});
app.use('/story', storyRouter);
app.use('/category', categoryRouter);
app.use('/comment',commentRouter);
app.use('/', indexRouter);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));

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

module.exports = server;