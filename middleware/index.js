var Campground  = require("../models/campground"),
    Comment     = require("../models/comment");

var middlewareObj = {};
var loginMessage = "Необходимо войти на сайт для редактирования постов";
var editMessage = "Вы не можетет редактировать чужой пост!";


middlewareObj.checkUserCampOwnership = function(req, res, next){
    if (req.isAuthenticated()) {
        // req.user is now known
        Campground.findById(req.params.id, function(err, foundCamp){
            if (err) {
                req.flash("error",  err.message);
                console.log(err);
                res.redirect("back");
            } else {
                if (foundCamp.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", editMessage);
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", loginMessage);
        res.redirect("back");   
    }   
};

middlewareObj.checkUserCommentOwnership = function(req, res, next){
    if (req.isAuthenticated()) {
        // req.user is now known
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err) {
                req.flash("error", err.message);
                console.log(err);
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", editMessage);
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", loginMessage);
        res.redirect("back");   
    }   
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("error", loginMessage);
        res.redirect("/login");
    }
};

module.exports = middlewareObj;
