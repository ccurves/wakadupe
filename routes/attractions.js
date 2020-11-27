import express from 'express';
import User from '../models/users';
import Attraction from '../models/attractions';
import config from './config';
import middlewareObj from '../middleware';
import multer from 'multer';
import cloudinary from 'cloudinary';
import NodeGeocoder from 'node-geocoder';

const options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: config.GEOCODER_API_KEY,
    formatter: null
};


const geocoder = NodeGeocoder(options);



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
    var noMatch = '';
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Attraction.find({ name: regex }, (err, attraction) => {
            if (err) {
                console.log(err);
            } else {

                if (attraction.length < 1) {
                    noMatch = "No attraction match that query, please try again"
                }
                res.render("attractions/index", { attractions: attraction, noMatch: noMatch });
            }
        })
    } else {
        // Get all attractions from DB
        Attraction.find({}, (err, attraction) => {
            if (err) {
                console.log(err);
            } else {
                res.render("attractions/index", { attractions: attraction, noMatch: noMatch });
            }
        })
    }

})

//Create - create new attraction
router.post("/", middlewareObj.isLoggedIn, upload.single('image'), (req, res) => {
    geocoder.geocode(req.body.attraction.location, function (err, data) {
        if (err || !data.length) {
            console.log(err)
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        } else {
            const lat = data[0].latitude;
            const lng = data[0].longitude;
            const location = data[0].formattedAddress;
            cloudinary.uploader.upload(req.file.path, function (result) {
                // add cloudinary url for the image to the attraction object under image property
                req.body.attraction.image = result.secure_url;
                //add image's public_id to attraction object
                req.body.attraction.imageId = result.public_id;
                // add author to attraction
                req.body.attraction.author = {
                    id: req.user._id,
                    username: req.user.username
                }

                req.body.attraction.location = location;
                req.body.attraction.lat = lat;
                req.body.attraction.lng = lng;
                Attraction.create(req.body.attraction, function (err, attraction) {
                    if (err) {
                        req.flash('error', err.message);
                        return res.redirect('back');
                    }
                    console.log(attraction)

                    res.redirect('/attractions/' + attraction.id);
                });
            });
        }

    });


});


//Renders the form to add an attraction
router.get("/new", middlewareObj.isLoggedIn, (req, res) => {

    res.render("attractions/new")

})

//Show - shows more info about an attraction
router.get("/:id", (req, res) => {

    //find the attraction with provided ID
    Attraction.findById(req.params.id).populate("comments").exec((err, foundAttraction) => {
        if (err) {
            console.log(err);
        } else {
            User.findById
            //render show template with details on the attraction
            res.render("attractions/show", { attraction: foundAttraction })
        }
    });


})

//Edit- edit an attraction
router.get("/:id/edit", middlewareObj.checkCampgroundOwnership, (req, res) => {

    Attraction.findById(req.params.id, (err, attraction) => {
        res.render("attractions/edit", { attraction: attraction });
    });

})
//Update - update the attraction
router.put("/:id", middlewareObj.checkCampgroundOwnership, upload.single('image'), (req, res) => {

    //find and update the correct attraction
    Attraction.findById(req.params.id, async (err, attraction) => {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back")
        } else {
            if (req.file) {
                try {
                    await cloudinary.uploader.destroy(attraction.imageId);
                    let result = cloudinary.uploader.upload(req.file.path);
                    attraction.imageId = result.public_id;
                    attraction.image = result.secure_url;
                } catch (err) {
                    req.flash("error", err.message);
                    return res.redirect("back")
                }
            } else {
                geocoder.geocode(req.body.location, function (err, data) {
                    if (err || !data.length) {
                        req.flash('error', 'Invalid address');
                        return res.redirect('back');
                    }
                    req.body.attraction.lat = data[0].latitude;
                    req.body.attraction.lng = data[0].longitude;
                    req.body.attraction.location = data[0].formattedAddress;
                    attraction.name = req.body.attraction.name;
                    attraction.description = req.body.attraction.description;
                    attraction.save();
                    req.flash("success", "Sucessfully Updated!");
                    res.redirect("/attractions/" + req.params.id);
                });
            }

        }
    })
})

//Destory - delete the attraction
router.delete("/:id", middlewareObj.checkCampgroundOwnership, (req, res) => {
    Attraction.findById(req.params.id, async (err, attraction) => {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back")
        } try {
            await cloudinary.uploader.destroy(attraction.imageId);
            attraction.remove();
            req.flash('success', 'Attraction deleted sucessfully!');
            res.redirect('/attractions')
        } catch (err) {
            req.flash("error", err.message);
            res.redirect("back")
        }
    });
})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

export default router;