var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js"); // index.js can be skipped


// NEW COMMENT FORM
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, camp){
        if (err) {
            req.flash("error", "Campground not found: " + err.message);
            console.log(err);
            res.redirect("back");
        } else {
            res.render("comments/new", {campground: camp});
        }
    });
});

// CREATE COMMENT
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
    var campId = req.params.id;
    var newComment =  req.body.comment;
    
     Campground.findById(campId, function(err, camp){
        if (err) {
            req.flash("error", "Campground not found: " + err.message);
            console.log(err);
            req.redirect("back");
        } else {
            Comment.create(newComment, function(err, comment) {
                if (err) {
                    req.flash("error", "Create comment problem: " + err.message);
                    console.log(err);
                    req.redirect("back");
                } else {
                    // req.user - is already known
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    camp.comments.push(comment);
                    camp.save();
                    req.flash("success", "Comment created!");
                    res.redirect("/campgrounds/" + camp._id);
                }                
            });
        }
    });
});


// EDIT COMMENT FORM
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkUserCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if (err) {
            req.flash("error", "Comment was not found: " + err.message);
            console.log(err);
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment });
        }
    });
});

// UPDATE COMMENT
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkUserCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err) {
            req.flash("error", "Comment was not found: " + err.message);
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", "Comment was updated!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY COMMENT
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkUserCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, removedComment){
        if (err) {
            req.flash("error", "Comment was not found: " + err.message);
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", "Comment was deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;
