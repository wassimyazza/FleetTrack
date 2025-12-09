import { Router } from "express";
import AuthController from "../controllers/AuthController.js";

const router = Router();

// authentification
router.post('/login', AuthController.login);


export default router;