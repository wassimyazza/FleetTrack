import Trip from "../models/Trip.js";

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
}

export default new TripController();