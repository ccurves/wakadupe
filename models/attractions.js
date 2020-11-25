import mongoose, { mongo } from 'mongoose';

const attractionSchema = new mongoose.Schema({
    name: String,
    image: String,
    imageId: String,
    description: String,
    location: String,
    lat: Number,
    lng: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
})

const Attraction = mongoose.model("Attraction", attractionSchema);

export default Attraction;