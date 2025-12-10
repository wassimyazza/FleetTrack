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
}

export default new TruckController();