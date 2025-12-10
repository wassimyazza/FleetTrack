import mongoose from "mongoose";

const truckSchema = new mongoose.Schema({
    plateNumber: {
        type: String,
        required: true,
        unique: true
    },
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    mileage: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["available", "in-use", "maintenance"],
        default: "available"
    },
    fuelConsumption: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model('Truck', truckSchema);