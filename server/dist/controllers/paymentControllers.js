"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.createOrder = void 0;
const crypto_1 = __importDefault(require("crypto"));
const razorpay_1 = __importDefault(require("../config/razorpay"));
const Event_1 = require("../models/Event");
const Registration_1 = require("../models/Registration");
const generateQrToken_1 = require("../utils/generateQrToken");
const sendEmail_1 = require("../utils/sendEmail");
/**
 * CREATE ORDER
 */
const createOrder = async (req, res) => {
    try {
        const { eventId, userEmail } = req.body;
        const existing = await Registration_1.Registration.findOne({
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
        const event = await Event_1.Event.findById(eventId);
        if (!event || !event.isPaid || !event.amount) {
            return res.status(400).json({ message: "Invalid paid event" });
        }
        const order = await razorpay_1.default.orders.create({
            amount: event.amount * 100,
            currency: "INR",
            receipt: `evt_${Date.now()}`,
        });
        return res.status(200).json({
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    }
    catch (error) {
        console.error("CREATE ORDER ERROR ", error);
        return res.status(500).json({ message: "Order creation failed" });
    }
};
exports.createOrder = createOrder;
/**
 * VERIFY PAYMENT + SAVE REGISTRATION
 */
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, eventId, name, department, semester, userEmail, } = req.body;
        if (!razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature) {
            return res.status(400).json({ message: "Payment data missing" });
        }
        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto_1.default
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");
        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid payment signature" });
        }
        const alreadyRegistered = await Registration_1.Registration.findOne({
            eventId,
            userEmail,
        });
        console.log(req.body);
        if (alreadyRegistered) {
            return res.status(409).json({
                message: "You are already registered for this event",
            });
        }
        //  SAVE REGISTRATION AFTER PAYMENT
        const qrToken = (0, generateQrToken_1.generateQrToken)();
        await Registration_1.Registration.create({
            eventId,
            name,
            department,
            semester,
            userEmail,
            qrToken,
            paymentStatus: "paid",
        });
        const event = await Event_1.Event.findById(eventId);
        await (0, sendEmail_1.sendEmail)(userEmail, "🎉 Event Registration Successful", `
    <h2>Registration Confirmed</h2>
    <p>You are successfully registered for:</p>
    <p><b>${event.name}</b></p>
    <p>Date: ${event.date}</p>
    <p>Venue: ${event.venue}</p>

    ${qrToken
            ? `<p>Show this QR at entry:</p>
           <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrToken}" />`
            : ""}

    <p>Thank you </p>
  `);
        return res.json({ message: "Payment verified & registration saved" });
    }
    catch (error) {
        console.error("VERIFY PAYMENT ERROR ", error);
        return res.status(500).json({ message: "Payment verification failed" });
    }
};
exports.verifyPayment = verifyPayment;
