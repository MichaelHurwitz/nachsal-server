import express from "express";
import { loginOfficer, getSubordinates, getBases, getTeamLeadersByBase } from "../controllers/officerController";
import { authenticateToken, authorizeCommander } from "../middleware/authMiddleware";

const router  = express.Router()

router.post('/officer/login', loginOfficer);
router.post('/officer/subordinates', authenticateToken, getSubordinates);
router.post('/officer/bases', authenticateToken, authorizeCommander, getBases);
router.post('/officer/teamLeaders', authenticateToken, authorizeCommander, getTeamLeadersByBase);

export default router;