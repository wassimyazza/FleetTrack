import Tire from "../models/Tire.js";

class TireController {
    
    async getAllTires(req, res) {
        try {
            const tires = await Tire.find().populate('truck');
            return res.status(200).json(tires);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export default new TireController();