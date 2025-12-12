import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema({
    truck: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Truck',
        required: true
    },
    type: {
        type: String,
        enum: ["tire-change", "oil-change", "revision", "repair"],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    cost: {
        type: Number,
        default: 0
    },
    mileage: {
        type: Number,
        required: true
    },
    nextMaintenanceAt: {
        type: Number
    }
}, { timestamps: true });

export default mongoose.model('Maintenance', maintenanceSchema);