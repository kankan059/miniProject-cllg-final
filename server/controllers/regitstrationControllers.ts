import { Request, Response } from "express";
import { Registration } from "../models/Registration";
import { Event } from "../models/Event";

export const createRegistration = async (req: Request, res: Response) => {
    const { name, department, semester, eventId, userEmail } = req.body;
    console.log(req.body)

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const alreadyRegistered = await Registration.findOne({
        eventId,
        userEmail,
    });

    if (alreadyRegistered) {
        return res.status(409).json({
            message: "You are already registered for this event",
        });
    }
    const registration = await Registration.create({
        name,
        department,
        semester,
        eventId,
        userEmail,
        paymentStatus: event.isPaid ? "pending" : "free",
        paidAmount: event.isPaid ? event.amount : 0,
    });

    res.status(201).json({
        registrationId: registration._id,
        isPaid: event.isPaid,
    });
};

// 🔹 Admin: get all registrations of an event
export const getRegistrationsByEvent = async (
    req: Request,
    res: Response
) => {
    const { eventId } = req.params;

    const registrations = await Registration.find({ eventId }).sort({
        createdAt: -1,
    });

    res.json(registrations);
};
