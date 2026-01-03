import express from "express";
import { Event } from "../models/Event";
import { Registration } from "../models/Registration";

const router = express.Router();

router.post("/", async (req, res) => {
  console.log('body : ', req.body);
  try {
    const { eventId, userId, name, department, semester } = req.body;

    if (!eventId || !userId || !name || !department || !semester) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // ATOMIC OPERATION (NO DUPLICATE POSSIBLE)
    const registration = await Registration.findOneAndUpdate(
      { eventId, userId }, // unique key
      {
        $setOnInsert: {
          name,
          department,
          semester,
          paidAmount: event.isPaid ? event.amount : 0,
          paymentStatus: event.isPaid ? "pending" : "paid",
        },
      },
      {
        new: true,
        upsert: true, // create if not exists
      }
    );

    return res.status(201).json({
      registration,
      requiresPayment: event.isPaid,
    });
  } catch (err: any) {
    // 🔐 duplicate safety
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: "Already registered for this event" });
    }

    console.error("REG ERROR", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
