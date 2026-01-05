import express from "express";
import { scanQr , getAttendanceSummary } from "../controllers/attendenceController";

const router = express.Router();

router.post("/scan", scanQr);
router.get("/summury/:eventId", getAttendanceSummary);

export default router;
