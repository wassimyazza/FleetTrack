import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    truck: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Truck',
        required: true
    },
    trailer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trailer'
    },
    departure: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    departureDate: {
        type: Date,
        required: true
    },
    arrivalDate: {
        type: Date
    },
    startMileage: {
        type: Number
    },
    endMileage: {
        type: Number
    },
    fuelUsed: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["todo", "in-progress", "completed"],
        default: "todo"
    },
    notes: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model('Trip', tripSchema);