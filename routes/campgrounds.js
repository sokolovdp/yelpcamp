var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");  // index.js can be skipped

var createMessage = "Вы успешно создали пост!";
var deleteMessage = "Вы успешно удалили пост!";
var updateMessage = "Вы успешно изменили пост!";

// INDEX ALL CAMPGROUNDs
router.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err);
            req.flash("error", err.message);
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
            req.flash("error",  err.message);
            console.log(err);
            req.redirect("back");
        } else {
            req.flash("success", createMessage);
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
            req.flash("error",  err.message);
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
            req.flash("error",  err.message);
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
            req.flash("error",  err.message);
            console.log(err);
            req.redirect("back");
        } else {
            req.flash("success", updateMessage);
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


// DESTROY CAMPGROUND
router.delete("/campgrounds/:id", middleware.checkUserCampOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err, updatedCamp){
        if (err) {
            req.flash("error",  err.message);
            console.log(err);
            req.redirect("back");
        } else {
            req.flash("success", deleteMessage);
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
