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
    async getTiresByTruck(req, res) {
        try {
            const tires = await Tire.find({ truck: req.params.truckId });
            return res.status(200).json(tires);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    async createTire(req, res) {
        try {
            const tire = await Tire.create(req.body);
            return res.status(201).json(tire);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    async updateTire(req, res) {
        try {
            const tire = await Tire.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            
            if (!tire) {
                return res.status(404).json({ message: "Tire not found" });
            }
            
            return res.status(200).json(tire);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export default new TireController();