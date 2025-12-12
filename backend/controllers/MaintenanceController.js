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
    async getMaintenancesByTruck(req, res) {
        try {
            const maintenances = await Maintenance.find({ truck: req.params.truckId });
            return res.status(200).json(maintenances);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    async createMaintenance(req, res) {
        try {
            const maintenance = await Maintenance.create(req.body);
            
            await Truck.findByIdAndUpdate(req.body.truck, { status: 'maintenance' });
            
            return res.status(201).json(maintenance);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export default new MaintenanceController();