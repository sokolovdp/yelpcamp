// Yelp-Camp solution

var express                   = require("express"),
        app                   = express(),
        flash                 = require("connect-flash"),
        // Campground            = require("./models/campground"),
        // Comment               = require("./models/comment"),
        User                  = require("./models/user"),
        passport              = require("passport"),
        localStrategy         = require("passport-local"),
        methodOverride        = require("method-override"),
        bodyParser            = require("body-parser");
        
var commentRoutes     = require("./routes/comments"),
    campgroundsRoutes = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(flash());  // use flash messages

var mongoose = require('mongoose');

mongoose.connect(process.env.DATABASEURL, {useMongoClient: true});
mongoose.Promise = global.Promise;


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Chiki Puki Taki",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// PASS USER VALUE TO ALL ROUTES
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// SET ROUTES
app.use(indexRoutes);
app.use(campgroundsRoutes);
app.use(commentRoutes);

// DEFAULT ROUTE
app.get("*", function(req, res){
    res.send("ТАКОЙ СТРАНИЦЫ НЕТ (((");
});

// START SERVER
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server has started, database url=" + process.env.DATABASEURL);
});