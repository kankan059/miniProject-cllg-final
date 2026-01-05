import express from "express";
import { createRegistration,getRegistrationsByEvent,getMyRegistrations} from "../controllers/regitstrationControllers";

const router = express.Router();

router.post("/", createRegistration);
router.get("/event/:eventId", getRegistrationsByEvent);
router.get("/myRe", getMyRegistrations);

export default router;
