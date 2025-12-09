import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    firstname:{
        required: true,
        type: String
    },
    lastname:{
        required: true,
        type: String
    },
    email:{
        required: true,
        type: String,
        unique: true,
    },
    password:{
        required: true,
        type: String,
        min: 6,
        max: 12
    },
    role:{
        type: String,
        enum: ["worker", "admin"],
        default: "worker"
    }
});

export default mongoose.model('User',userSchema);