import Trailer from "../models/Trailer.js";

class TrailerController {
    
    async getAllTrailers(req, res) {
        try {
            const trailers = await Trailer.find();
            return res.status(200).json(trailers);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    async getTrailerById(req, res) {
        try {
            const trailer = await Trailer.findById(req.params.id);
            if (!trailer) {
                return res.status(404).json({ message: "Trailer not found" });
            }
            return res.status(200).json(trailer);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    async createTrailer(req, res) {
        try {
            const { plateNumber } = req.body;
            
            const existingTrailer = await Trailer.findOne({ plateNumber });
            if (existingTrailer) {
                return res.status(400).json({ message: "Plate number already exists" });
            }
            
            const trailer = await Trailer.create(req.body);
            return res.status(201).json(trailer);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export default new TrailerController();