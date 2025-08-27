import mongoose from "mongoose";


const serviceSchema=new mongoose.Schema({
    userID: {
        type: String, 
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    images: {
        type: [String], // An array of strings to store URLs
        default: [],
    },

},
{timestamps:true}
);

const Service=mongoose.model("Service",serviceSchema)
export default Service