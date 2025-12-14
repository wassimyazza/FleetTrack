import Trip from "../models/Trip.js";
import Truck from "../models/Truck.js";
import Maintenance from "../models/Maintenance.js";
import User from "../models/User.js";

class ReportController {
    
    async getFuelConsumptionReport(req, res) {
        try {
            const { startDate, endDate } = req.query;
            
            const filter = { status: 'completed' };
            if (startDate && endDate) {
                filter.departureDate = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }
            
            const trips = await Trip.find(filter).populate('truck', 'plateNumber');
            
            const fuelReport = {};
            trips.forEach(trip => {
                const truckId = trip.truck._id.toString();
                if (!fuelReport[truckId]) {
                    fuelReport[truckId] = {
                        truck: trip.truck.plateNumber,
                        totalFuel: 0,
                        tripCount: 0
                    };
                }
                fuelReport[truckId].totalFuel += trip.fuelUsed || 0;
                fuelReport[truckId].tripCount += 1;
            });
            
            return res.status(200).json(Object.values(fuelReport));
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    
    async getMileageReport(req, res) {
        try {
            const { startDate, endDate } = req.query;
            
            const filter = { status: 'completed' };
            if (startDate && endDate) {
                filter.departureDate = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }
            
            const trips = await Trip.find(filter).populate('truck', 'plateNumber mileage');
            
            const mileageReport = {};
            trips.forEach(trip => {
                const truckId = trip.truck._id.toString();
                const distance = (trip.endMileage || 0) - (trip.startMileage || 0);
                
                if (!mileageReport[truckId]) {
                    mileageReport[truckId] = {
                        truck: trip.truck.plateNumber,
                        totalDistance: 0,
                        currentMileage: trip.truck.mileage,
                        tripCount: 0
                    };
                }
                mileageReport[truckId].totalDistance += distance;
                mileageReport[truckId].tripCount += 1;
            });
            
            return res.status(200).json(Object.values(mileageReport));
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    
    async getMaintenanceReport(req, res) {
        try {
            const { startDate, endDate } = req.query;
            
            const filter = {};
            if (startDate && endDate) {
                filter.date = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }
            
            const maintenances = await Maintenance.find(filter).populate('truck', 'plateNumber');
            
            const report = {
                totalCost: 0,
                byType: {},
                byTruck: {}
            };
            
            maintenances.forEach(maintenance => {
                report.totalCost += maintenance.cost || 0;
                
                if (!report.byType[maintenance.type]) {
                    report.byType[maintenance.type] = {
                        count: 0,
                        totalCost: 0
                    };
                }
                report.byType[maintenance.type].count += 1;
                report.byType[maintenance.type].totalCost += maintenance.cost || 0;
                
                const truckId = maintenance.truck._id.toString();
                if (!report.byTruck[truckId]) {
                    report.byTruck[truckId] = {
                        truck: maintenance.truck.plateNumber,
                        count: 0,
                        totalCost: 0
                    };
                }
                report.byTruck[truckId].count += 1;
                report.byTruck[truckId].totalCost += maintenance.cost || 0;
            });
            
            return res.status(200).json(report);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    
    async getDriverPerformance(req, res) {
        try {
            const trips = await Trip.find({ status: 'completed' })
                .populate('driver', 'firstname lastname email');
            
            const performance = {};
            
            trips.forEach(trip => {
                const driverId = trip.driver._id.toString();
                const distance = (trip.endMileage || 0) - (trip.startMileage || 0);
                
                if (!performance[driverId]) {
                    performance[driverId] = {
                        driver: `${trip.driver.firstname} ${trip.driver.lastname}`,
                        email: trip.driver.email,
                        totalTrips: 0,
                        totalDistance: 0,
                        totalFuel: 0,
                        averageFuelConsumption: 0
                    };
                }
                
                performance[driverId].totalTrips += 1;
                performance[driverId].totalDistance += distance;
                performance[driverId].totalFuel += trip.fuelUsed || 0;
            });
            
            Object.values(performance).forEach(p => {
                if (p.totalDistance > 0) {
                    p.averageFuelConsumption = (p.totalFuel / p.totalDistance * 100).toFixed(2);
                }
            });
            
            return res.status(200).json(Object.values(performance));
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    
    async getDashboard(req, res) {
        try {
            const totalTrucks = await Truck.countDocuments();
            const availableTrucks = await Truck.countDocuments({ status: 'available' });
            const trucksInUse = await Truck.countDocuments({ status: 'in-use' });
            const trucksInMaintenance = await Truck.countDocuments({ status: 'maintenance' });
            
            const totalTrips = await Trip.countDocuments();
            const completedTrips = await Trip.countDocuments({ status: 'completed' });
            const activeTrips = await Trip.countDocuments({ status: 'in-progress' });
            const pendingTrips = await Trip.countDocuments({ status: 'todo' });
            
            const totalMaintenances = await Maintenance.countDocuments();
            const maintenanceCosts = await Maintenance.aggregate([
                { $group: { _id: null, total: { $sum: '$cost' } } }
            ]);
            
            const totalFuel = await Trip.aggregate([
                { $match: { status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$fuelUsed' } } }
            ]);
            
            const totalDrivers = await User.countDocuments({ role: 'chauffeur' });
            
            return res.status(200).json({
                trucks: {
                    total: totalTrucks,
                    available: availableTrucks,
                    inUse: trucksInUse,
                    inMaintenance: trucksInMaintenance
                },
                trips: {
                    total: totalTrips,
                    completed: completedTrips,
                    active: activeTrips,
                    pending: pendingTrips
                },
                maintenance: {
                    total: totalMaintenances,
                    totalCost: maintenanceCosts[0]?.total || 0
                },
                fuel: {
                    totalConsumed: totalFuel[0]?.total || 0
                },
                drivers: {
                    total: totalDrivers
                }
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export default new ReportController();