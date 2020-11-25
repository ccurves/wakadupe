import express from 'express';
import passport from 'passport';
import User from '../models/users';
import Attraction from '../models/attractions';
import multer from 'multer';
import cloudinary from 'cloudinary';
import config from './config'


//Configure multer & cloudinary to upload 
const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});
const imageFilter = (req, file, cb) => {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter })


cloudinary.config({
    cloud_name: 'wakadupe',
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET
});



const router = express.Router();


router.get("/", (req, res) => {
    res.render("landing")
})

router.get("/about", (req, res) => {
    res.render("about")
})


//show register form
router.get("/register", (req, res) => {
    res.render("register")
});

//handle sign up logic
router.post("/register", upload.single('image'), (req, res) => {

    cloudinary.uploader.upload(req.file.path, function (result) {
        // add cloudinary url for the image to the attraction object under image property
        req.body.image = result.secure_url;
        const newUser = new User({
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            avatar: req.body.image,
            bio: req.body.bio
        });
        User.register(newUser, req.body.password, (err, user) => {
            if (err) {
                req.flash("error", err.message);
                return res.render("register")
            }
            passport.authenticate("local")(req, res, () => {
                req.flash("success", "Welcome to WakaDupe " + user.username)
                res.redirect("/attractions")
            })
        })
    });
})

//show login form
router.get("/login", (req, res) => {
    res.render("login")
});
//handling login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/attractions",
    failureRedirect: "/login"

}), (req, res) => {
    req.flash("success", "Welcome to WakaDupe " + user.username)
})
//logout route
router.get("/logout", (req, res) => {
    req.logOut();
    req.flash("success", "We are sad to see you go!");
    res.redirect("/attractions")
})

//User Profile
router.get("/users/:id", (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/");
        }
        Attraction.find().where('author.id').equals(user._id).exec((err, attractions) => {
            if (err) {
                req.flash("error", err.message);
                res.redirect("/");
            }
            res.render("users/show", { user: user, attractions: attractions });
        })

    })
})

export default router;