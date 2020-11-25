import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose'

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    username: String,
    password: String,
    avatar: String,
    bio: String,

})

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

export default User;