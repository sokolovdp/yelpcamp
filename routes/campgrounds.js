var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");  // index.js can be skipped


// INDEX ALL CAMPGROUNDs
router.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err);
            req.flash("error", "Campground create problem: " + err.message);
            req.redirect("back");
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// CREATE NEW CAMPGROUND
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
    // req.user has been already known
    var campName = req.body.name;
    var campImage = req.body.image;
    var campDescr = req.body.descr;
    var campAuthor = {
        id: req.user._id,
        username: req.user.username
    };
    var newCamp = {
        name: campName, 
        image: campImage, 
        description: campDescr, 
        author: campAuthor
    };

    Campground.create(newCamp, function(err, campground) {
        if (err) {
            req.flash("error", "Campground create problem: " + err.message);
            console.log(err);
            req.redirect("back");
        } else {
            req.flash("success", "Campground created!");
            res.redirect("/campgrounds");
        }
    });
});

// NEW CAMGROUND FORM
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// SHOW CAMPGROUND by ID
router.get("/campgrounds/:id", function(req, res){
    var campId = req.params.id;
    
    Campground.findById(campId).populate("comments").exec(function(err, camp){
        if (err) {
            req.flash("error", "Campground not found: " + err.message);
            console.log(err);
            req.redirect("back");
        } else {
            res.render("campgrounds/show", {campground: camp});
        }
    });
});

// EDIT CAMPGROUND FORM
router.get("/campgrounds/:id/edit", middleware.checkUserCampOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCamp){
        if (err) {
            req.flash("error", "Campground not found: " + err.message);
            console.log(err);
            req.redirect("back");
        } else {
            res.render("campgrounds/edit", {campground: foundCamp});
        }
    });
});

// UPDATE CAMPGROUND
router.put("/campgrounds/:id", middleware.checkUserCampOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground,  function(err, updatedCamp){
        if (err) {
            req.flash("error", "Campground not found: " + err.message);
            console.log(err);
            req.redirect("back");
        } else {
            req.flash("success", "Campground Info Updated!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


// DESTROY CAMPGROUND
router.delete("/campgrounds/:id", middleware.checkUserCampOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err, updatedCamp){
        if (err) {
            req.flash("error", "Campground not found: " + err.message);
            console.log(err);
            req.redirect("back");
        } else {
            req.flash("success", "Campground deleted!")
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
