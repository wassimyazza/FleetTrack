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
    async updateMaintenance(req, res) {
        try {
            const maintenance = await Maintenance.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            
            if (!maintenance) {
                return res.status(404).json({ message: "Maintenance not found" });
            }
            
            return res.status(200).json(maintenance);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    async deleteMaintenance(req, res) {
        try {
            const maintenance = await Maintenance.findByIdAndDelete(req.params.id);
            
            if (!maintenance) {
                return res.status(404).json({ message: "Maintenance not found" });
            }
            
            return res.status(200).json({ message: "Maintenance deleted successfully" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    async getUpcomingMaintenances(req, res) {
        try {
            const maintenances = await Maintenance.find({
                nextMaintenanceAt: { $exists: true, $ne: null }
            })
            .populate('truck', 'plateNumber mileage')
            .sort({ nextMaintenanceAt: 1 });
            
            const upcoming = maintenances.filter(m => {
                return m.truck.mileage < m.nextMaintenanceAt;
            });
            
            return res.status(200).json(upcoming);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export default new MaintenanceController();