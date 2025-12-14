import Trip from "../models/Trip.js";
import Truck from "../models/Truck.js";
import Trailer from "../models/Trailer.js";
import { generateTripPDF } from "../utils/pdfGenerator.js";

class TripController {
    
    async getAllTrips(req, res) {
        try {
            const trips = await Trip.find()
                .populate('driver', 'firstname lastname email')
                .populate('truck')
                .populate('trailer');
            return res.status(200).json(trips);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    
    async getMyTrips(req, res) {
        try {
            const trips = await Trip.find({ driver: req.user.id })
                .populate('truck')
                .populate('trailer');
            return res.status(200).json(trips);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    
    async getTripById(req, res) {
        try {
            const trip = await Trip.findById(req.params.id)
                .populate('driver', 'firstname lastname email')
                .populate('truck')
                .populate('trailer');
            
            if (!trip) {
                return res.status(404).json({ message: "Trip not found" });
            }
            
            return res.status(200).json(trip);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    
    async createTrip(req, res) {
        try {
            const trip = await Trip.create(req.body);
            
            await Truck.findByIdAndUpdate(req.body.truck, { status: 'in-use' });
            if (req.body.trailer) {
                await Trailer.findByIdAndUpdate(req.body.trailer, { status: 'in-use' });
            }
            
            return res.status(201).json(trip);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    
    async updateTrip(req, res) {
        try {
            const trip = await Trip.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            
            if (!trip) {
                return res.status(404).json({ message: "Trip not found" });
            }
            
            return res.status(200).json(trip);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    
    async updateTripStatus(req, res) {
        try {
            const { status, startMileage, endMileage, fuelUsed, notes } = req.body;
            
            const trip = await Trip.findById(req.params.id);
            
            if (!trip) {
                return res.status(404).json({ message: "Trip not found" });
            }
            
            if (startMileage) trip.startMileage = startMileage;
            if (endMileage) trip.endMileage = endMileage;
            if (fuelUsed) trip.fuelUsed = fuelUsed;
            if (notes) trip.notes = notes;
            
            if (status === 'completed' && trip.endMileage && trip.startMileage) {
                const distance = trip.endMileage - trip.startMileage;
                await Truck.findByIdAndUpdate(trip.truck, {
                    $inc: { mileage: distance, fuelConsumption: fuelUsed || 0 },
                    status: 'available'
                });
            } else if (status === 'completed') {
                await Truck.findByIdAndUpdate(trip.truck, { status: 'available' });
            }
            
            if (trip.trailer && status === 'completed') {
                await Trailer.findByIdAndUpdate(trip.trailer, { status: 'available' });
            }
            
            trip.status = status;
            await trip.save();
            
            return res.status(200).json(trip);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    
    async deleteTrip(req, res) {
        try {
            const trip = await Trip.findByIdAndDelete(req.params.id);
            
            if (!trip) {
                return res.status(404).json({ message: "Trip not found" });
            }
            
            return res.status(200).json({ message: "Trip deleted successfully" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    
    async downloadTripPDF(req, res) {
        try {
            const trip = await Trip.findById(req.params.id)
                .populate('driver', 'firstname lastname')
                .populate('truck')
                .populate('trailer');
            
            if (!trip) {
                return res.status(404).json({ message: "Trip not found" });
            }
            
            const pdfBuffer = await generateTripPDF(trip);
            
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=trip-${trip._id}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export default new TripController();