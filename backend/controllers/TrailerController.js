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
}

export default new TrailerController();