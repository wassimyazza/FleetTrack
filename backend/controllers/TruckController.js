import Truck from "../models/Truck.js";

class TruckController {
    
    async getAllTrucks(req, res) {
        try {
            const trucks = await Truck.find();
            return res.status(200).json(trucks);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getTruckById(req, res) {
        try {
            const truck = await Truck.findById(req.params.id);
            if (!truck) {
                return res.status(404).json({ message: "Truck not found" });
            }
            return res.status(200).json(truck);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async createTruck(req, res) {
        try {
            const { plateNumber, brand, model, year } = req.body;
            
            const existingTruck = await Truck.findOne({ plateNumber });
            if (existingTruck) {
                return res.status(400).json({ message: "Plate number already exists" });
            }
            
            const truck = await Truck.create(req.body);
            return res.status(201).json(truck);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export default new TruckController();