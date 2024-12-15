import { getEventsHistory, getActiveEvents, createEvent, getEvent} from "../controllers/evenController"
import { Router } from "express";
import { authorizeCommander, authenticateToken } from "../middleware/authMiddleware";

const router = Router()

router.post('/events/history', authenticateToken, authorizeCommander, getEventsHistory)
router.post('/events/event', authenticateToken, getEvent)
router.post('/events/active',authenticateToken , getActiveEvents)
router.post('/events/start',authenticateToken, authorizeCommander, createEvent)

export default router