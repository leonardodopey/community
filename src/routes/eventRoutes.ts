import { Router } from "express";
import {
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
} from "../controllers/eventController";
import { authenticate, requireOrganizer } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, getEvent);
router.get("/myevents", authenticate, requireOrganizer, getMyEvents);
router.post("/create", authenticate, requireOrganizer, createEvent);
router.put("/:id", authenticate, requireOrganizer, updateEvent);
router.delete("/:id", authenticate, requireOrganizer, deleteEvent);

export default router;
