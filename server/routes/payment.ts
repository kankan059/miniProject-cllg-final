import { Router, Request, Response } from "express";
import crypto from "crypto";
import razorpay from "../config/razorpay";
import { Event } from "../models/Event";
import { Registration } from "../models/Registration";

const router = Router();

/**
 * CREATE RAZORPAY ORDER
 */
router.post("/create-order", async (req: Request, res: Response) => {
  try {
    const { eventId,  userId } = req.body;

    const event = await Event.findById(eventId);
    if (!event || !event.isPaid || !event.amount) {
      return res.status(400).json({ message: "Invalid paid event" });
    }

    const order = await razorpay.orders.create({
      amount: event.amount * 100,
      currency: "INR",
      receipt: `evt_${Date.now()}`,
    });

    // Mark registration as pending
    await Registration.findByIdAndUpdate( userId, {
      paymentStatus: "pending",
      paidAmount: event.amount,
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Order creation failed" });
  }
});

/**
 * VERIFY PAYMENT
 */
router.post("/verify", async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
       userId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await Registration.findByIdAndUpdate( userId, {
        paymentStatus: "failed",
      });

      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // ✅ Payment verified
    await Registration.findByIdAndUpdate( userId, {
      paymentStatus: "paid",
      paidAmount: undefined, // already set
    });

    res.json({ message: "Payment verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment verification failed" });
  }
});

export default router;
