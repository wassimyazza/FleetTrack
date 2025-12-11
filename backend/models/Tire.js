import mongoose from "mongoose";

const tireSchema = new mongoose.Schema({
    truck: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Truck',
        required: true
    },
    position: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    installationDate: {
        type: Date,
        required: true
    },
    mileageAtInstallation: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["good", "worn", "replaced"],
        default: "good"
    }
}, { timestamps: true });

export default mongoose.model('Tire', tireSchema);