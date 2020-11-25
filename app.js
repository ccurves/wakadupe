import express from 'express';
import bodyParser from 'body-parser'
import mongoose from 'mongoose';
import flash from 'connect-flash';
import passport from 'passport';
import dotenv from 'dotenv';
import config from './routes/config';
import localStrategy from 'passport-local';
import expressSession from 'express-session';
import User from './models/users';
import methodOverride from 'method-override';
import seedDB from './seeds';
import commentRoutes from './routes/comments';
import attractionRoutes from './routes/attractions';
import indexRoutes from './routes/index';

// seedDB();


dotenv.config();

const app = express();

mongoose.connect("mongodb://localhost/waka_dupe", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
// Static Middleware 
app.use(express.static(__dirname + '/public'))
app.use(methodOverride("_method"))

// View Engine Setup 
app.set("view engine", "ejs");

//Passport Configuration
app.use(expressSession({
    secret: "Say my name",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use("/", indexRoutes);
app.use("/attractions", attractionRoutes);
app.use("/attractions/:id/comments/", commentRoutes)


app.listen(2000, () => { console.log("Server started at http://localhost:2000") }); 
