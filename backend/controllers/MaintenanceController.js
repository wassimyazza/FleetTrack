import Maintenance from "../models/Maintenance.js";
import Truck from "../models/Truck.js";

class MaintenanceController {
    
    async getAllMaintenances(req, res) {
        try {
            const maintenances = await Maintenance.find().populate('truck');
            return res.status(200).json(maintenances);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    
}

export default new MaintenanceController();