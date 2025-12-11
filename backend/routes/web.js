import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import TruckController from "../controllers/TruckController.js";
import auth from "../middlewares/auth.js";
import checkRole from "../middlewares/role.js";
import TrailerController from "../controllers/TrailerController.js";

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

export default router;