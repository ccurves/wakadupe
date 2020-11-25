import mongoose from 'mongoose';
import Attraction from './models/attractions';
import Comment from './models/comment'

const data = [
    {
        name: "Nike Art Gallery",
        image: "",
        description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cumque accusantium odit, molestiae, praesentium blanditiis explicabo illum quaerat quas, voluptatibus voluptate minus facilis aliquam officia mollitia vero possimus quae. Beatae temporibus ipsa voluptatum hic totam deserunt incidunt soluta? Nostrum labore temporibus perspiciatis totam dolor expedita ab blanditiis fugiat minus, natus officia."
    },
    {
        name: "Obudu Cattle Ranch",
        image: "/1.jpg",
        description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cumque accusantium odit, molestiae, praesentium blanditiis explicabo illum quaerat quas, voluptatibus voluptate minus facilis aliquam officia mollitia vero possimus quae. Beatae temporibus ipsa voluptatum hic totam deserunt incidunt soluta? Nostrum labore temporibus perspiciatis totam dolor expedita ab blanditiis fugiat minus, natus officia."
    },
    {
        name: "Kanjru Castle",
        image: "/pic.png",
        description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cumque accusantium odit, molestiae, praesentium blanditiis explicabo illum quaerat quas, voluptatibus voluptate minus facilis aliquam officia mollitia vero possimus quae. Beatae temporibus ipsa voluptatum hic totam deserunt incidunt soluta? Nostrum labore temporibus perspiciatis totam dolor expedita ab blanditiis fugiat minus, natus officia."
    }
]

const seedDB = () => {
    //Remove all campgrounds
    Attraction.remove({}, (err) => {
        // if (err) {
        //     console.log(err);
        // } else {
        //     console.log("removed attractions")
        //     //add a few camgrounds
        //     data.forEach((seed) => {
        //         Attraction.create(seed, (err, attraction) => {
        //             if (err) {
        //                 console.log(err)
        //             } else {
        //                 console.log("added a attraction")
        //                 //create a comment
        //                 Comment.create(
        //                     {
        //                         text: "This is a great site",
        //                         author: "Bob"
        //                     }, (err, comment) => {
        //                         if (err) {
        //                             console.log(err);
        //                         } else {
        //                             attraction.comments.push(comment);
        //                             attraction.save();
        //                             console.log("Created a comment")
        //                         }
        //                     }
        //                 )
        //             }
        //         })
        //     })
        // }
    });

}

export default seedDB;