import express from "express";
import { updateSoldierLocationController, validateSoldierEventController } from "../controllers/soldierController";

const router  = express.Router()

router.post("/validate-soldier/:personalNumber/:eventId", validateSoldierEventController);
router.post("/soldier/location", updateSoldierLocationController);

export default router