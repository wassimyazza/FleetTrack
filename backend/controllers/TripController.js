import Trip from "../models/Trip.js";
import Truck from "../models/Truck.js";
import Trailer from "../models/Trailer.js";

class TripController {
    
    async getAllTrips(req, res) {
        try {
            const trips = await Trip.find()
                .populate('driver', 'firstname lastname email')
                .populate('truck')
                .populate('trailer');
            return res.status(200).json(trips);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getTripById(req, res) {
        try {
            const trip = await Trip.findById(req.params.id)
                .populate('driver', 'firstname lastname email')
                .populate('truck')
                .populate('trailer');
            
            if (!trip) {
                return res.status(404).json({ message: "Trip not found" });
            }
            
            return res.status(200).json(trip);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async createTrip(req, res) {
        try {
            const trip = await Trip.create(req.body);
            
            await Truck.findByIdAndUpdate(req.body.truck, { status: 'in-use' });
            if (req.body.trailer) {
                await Trailer.findByIdAndUpdate(req.body.trailer, { status: 'in-use' });
            }
            
            return res.status(201).json(trip);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    async updateTrip(req, res) {
        try {
            const trip = await Trip.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            
            if (!trip) {
                return res.status(404).json({ message: "Trip not found" });
            }
            
            return res.status(200).json(trip);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export default new TripController();