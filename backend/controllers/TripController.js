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
}

export default new TripController();