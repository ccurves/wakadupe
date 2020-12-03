import express from 'express';
const router = express.Router({ mergeParams: true });
import Attraction from '../models/attractions';
import Comment from '../models/comment';
import middlewareObj from '../middleware';


//===================
// COMMENTS NEW
//====================
router.get("/new", middlewareObj.isLoggedIn, (req, res) => {
    //find attraction by id
    Attraction.findById(req.params.id, (err, attraction) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { attraction: attraction })
        }
    })
});


//===================
// COMMENTS CREATE
//====================

router.post("/", middlewareObj.isLoggedIn, (req, res) => {
    //find an attraction by id
    Attraction.findById(req.params.id, (err, attraction) => {
        if (err) {
            console.log(err);
        } else {
            //create new comment
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    req.flash("error", "Something went wrong");
                    console.log(err)
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //connect new comment to the attraction
                    attraction.comments.push(comment);
                    attraction.save();
                    //redirect to the show page
                    res.redirect("/attractions/" + req.params.id);
                }
            })
        }
    })


});


//===================
// COMMENTS EDIT
//====================
router.get("/:comment_id/edit", middlewareObj.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", { attraction_id: req.params.id, comment: foundComment });
        }
    })

})

//===================
// COMMENTS UPDATE
//====================
router.put("/:comment_id", middlewareObj.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Sucessfully updated comment")
            res.redirect("/attractions/" + req.params.id);
        }
    })
})

//===================
// COMMENTS DESTROY
//====================
router.delete("/:comment_id", middlewareObj.checkCommentOwnership, (req, res) => {
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted")
            res.redirect("/attractions/" + req.params.id);
        }
    })
})






export default router;