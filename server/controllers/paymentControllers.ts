import { Request, Response } from "express";
import crypto from "crypto";
import razorpay from "../config/razorpay";
import { Event } from "../models/Event";
import { Registration } from "../models/Registration";

/**
 * CREATE ORDER
 */
export const createOrder = async (req: Request, res: Response) => {
    try {
        const { eventId, userEmail } = req.body;
        const existing = await Registration.findOne({
            eventId,
            userEmail,
        });
        console.log(req.body);

        if (existing) {
            return res.status(409).json({
                message: "Already registered for this event",
            });
        }
        if (!eventId) {
            return res.status(400).json({ message: "eventId missing" });
        }

        const event = await Event.findById(eventId);
        if (!event || !event.isPaid || !event.amount) {
            return res.status(400).json({ message: "Invalid paid event" });
        }

        const order = await razorpay.orders.create({
            amount: event.amount * 100,
            currency: "INR",
            receipt: `evt_${Date.now()}`,
        });

        return res.status(200).json({
            order_id: order.id,   
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error) {
        console.error("CREATE ORDER ERROR ", error);
        return res.status(500).json({ message: "Order creation failed" });
    }
};

/**
 * VERIFY PAYMENT + SAVE REGISTRATION
 */
export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            eventId,
            name,
            department,
            semester,
            userEmail,
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({ message: "Payment data missing" });
        }

        const body = `${razorpay_order_id}|${razorpay_payment_id}`;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid payment signature" });
        }
        const alreadyRegistered = await Registration.findOne({
            eventId,
            userEmail,
        });
        console.log(req.body)

        if (alreadyRegistered) {
            return res.status(409).json({
                message: "You are already registered for this event",
            });
        }
        //  SAVE REGISTRATION AFTER PAYMENT
        await Registration.create({
            eventId,
            name,
            department,
            semester,
            userEmail,
            paymentStatus: "paid",
        });

        return res.json({ message: "Payment verified & registration saved" });
    } catch (error) {
        console.error("VERIFY PAYMENT ERROR ", error);
        return res.status(500).json({ message: "Payment verification failed" });
    }
};
