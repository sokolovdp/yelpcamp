var Campground  = require("../models/campground"),
    Comment     = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkUserCampOwnership = function(req, res, next){
    if (req.isAuthenticated()) {
        // req.user is now known
        Campground.findById(req.params.id, function(err, foundCamp){
            if (err) {
                req.flash("error", "Campground not found: " + err.message);
                console.log(err);
                res.redirect("back");
            } else {
                if (foundCamp.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You are not allowed to edit this campground!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please Login First!");
        res.redirect("back");   
    }   
};

middlewareObj.checkUserCommentOwnership = function(req, res, next){
    if (req.isAuthenticated()) {
        // req.user is now known
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err) {
                req.flash("error", "Comment not found: " + err.message);
                console.log(err);
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You are not allowed to edit this comment!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please Login First!");
        res.redirect("back");   
    }   
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("error", "Please Login First!");
        res.redirect("/login");
    }
};

module.exports = middlewareObj;
