import express from "express";
import { createRegistration,getRegistrationsByEvent,} from "../controllers/regitstrationControllers";

const router = express.Router();

router.post("/", createRegistration);
router.get("/event/:eventId", getRegistrationsByEvent);

export default router;
