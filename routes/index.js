var express = require("express");
var router = express.Router({mergeParams: true});
var User = require("../models/user");
var passport = require("passport");


// HOME ROUTE
router.get("/", function(req, res){
    res.render("landing");
});


// AUTH ROUTES
router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            req.flash("error", "Register error: " + err.message);
            console.log(err);
            res.redirect('/register');
        } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to our site!");
                res.redirect("/campgrounds"); 
            });
        }
    });
});

router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds", 
        failureRedirect: "/login",
        successFlash: 'Welcome back!',
        failureFlash: 'Invalid login credentials, try again or register'
    }),  function(req, res){});

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You were logged out!");
    res.redirect("/campgrounds");
});


module.exports = router;
