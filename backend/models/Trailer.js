import mongoose from "mongoose";

const trailerSchema = new mongoose.Schema({
    plateNumber: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["available", "in-use", "maintenance"],
        default: "available"
    }
}, { timestamps: true });

export default mongoose.model('Trailer', trailerSchema);