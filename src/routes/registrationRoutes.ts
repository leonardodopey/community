import { Router } from "express";
import {
  registerToEvent,
  getMyEventRegistrations,
  getVolunteerRegistrations,
} from "../controllers/registrationController";
import { authenticate, requireOrganizer } from "../middleware/auth";

const router = Router();
router.post("/:eventId", authenticate, registerToEvent);
router.get(
  "/my/:eventId",
  authenticate,
  requireOrganizer,
  getMyEventRegistrations
);
router.get("/myregs", authenticate, getVolunteerRegistrations);

export default router;
