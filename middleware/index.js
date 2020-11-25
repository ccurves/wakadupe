import Attraction from '../models/attractions';
import Comment from '../models/comment';
const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    //check if user logged in?
    if (req.isAuthenticated()) {
        Attraction.findById(req.params.id, (err, attraction) => {
            if (err) {
                res.redirect("back")
            } else {
                //check if user owns the attraction
                if (attraction.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.send("You do not have permission to do that")
                }

            }
        })
    } else {
        res.redirect("back")
    }

};

middlewareObj.checkCommentOwnership = function (req, res, next) {
    //check if user logged in?
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, comment) => {
            if (err) {
                req.flash("error", "Sorry, could not find that Attraction")
                res.redirect("back")
            } else {
                //check if user owns the comment
                if (comment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Sorry, you do not have permissin to do that");
                }

            }
        })
    } else {
        req.flash("error", "You need to be logged in to do that")
        res.redirect("back")
    }

}


middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Oof! You need to be logged in to do that");
    res.redirect("/login");

}
export default middlewareObj;