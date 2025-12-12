import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import TruckController from "../controllers/TruckController.js";
import auth from "../middlewares/auth.js";
import checkRole from "../middlewares/role.js";
import TrailerController from "../controllers/TrailerController.js";
import TireController from "../controllers/TireController.js";
import TripController from "../controllers/TripController.js";
import MaintenanceController from "../controllers/MaintenanceController.js";

const router = Router();

// authentification
router.post('/login', AuthController.login);
router.post('/register',AuthController.register);

// truck routers
router.get('/trucks', auth, TruckController.getAllTrucks);
router.get('/trucks/:id', auth, TruckController.getTruckById);
router.post('/trucks', auth, checkRole(['admin']), TruckController.createTruck);
router.put('/trucks/:id', auth, checkRole(['admin']), TruckController.updateTruck);
router.delete('/trucks/:id', auth, checkRole(['admin']), TruckController.deleteTruck);

// trailer routers
router.get('/trailers', auth, TrailerController.getAllTrailers);
router.get('/trailers/:id', auth, TrailerController.getTrailerById);
router.post('/trailers', auth, checkRole(['admin']), TrailerController.createTrailer);
router.put('/trailers/:id', auth, checkRole(['admin']), TrailerController.updateTrailer);
router.delete('/trailers/:id', auth, checkRole(['admin']), TrailerController.deleteTrailer);

// tire routers
router.get('/tires', auth, checkRole(['admin']), TireController.getAllTires);
router.get('/tires/truck/:truckId', auth, TireController.getTiresByTruck);
router.post('/tires', auth, checkRole(['admin']), TireController.createTire);
router.put('/tires/:id', auth, checkRole(['admin']), TireController.updateTire);
router.delete('/tires/:id', auth, checkRole(['admin']), TireController.deleteTire);

// trip routers
router.get('/trips', auth, checkRole(['admin']), TripController.getAllTrips);
router.get('/trips/:id', auth, TripController.getTripById);
router.post('/trips', auth, checkRole(['admin']), TripController.createTrip);
router.put('/trips/:id', auth, checkRole(['admin']), TripController.updateTrip);
router.delete('/trips/:id', auth, checkRole(['admin']), TripController.deleteTrip);
router.patch('/trips/:id/status', auth, TripController.updateTripStatus);
router.get('/my-trips', auth, TripController.getMyTrips);
router.get('/trips/:id/pdf', auth, TripController.downloadTripPDF);

// maintenance routers
router.get('/maintenances', auth, checkRole(['admin']), MaintenanceController.getAllMaintenances);
router.get('/maintenances/truck/:truckId', auth, MaintenanceController.getMaintenancesByTruck);



export default router;