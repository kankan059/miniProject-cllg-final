"use strict";
// import { Request, Response } from "express";
// import { Registration } from "../models/Registration";
// import { Event } from "../models/Event";
// import mongoose from "mongoose";
// import { generateQrToken } from "../utils/generateQrToken";
// import { sendEmail } from "../utils/sendEmail";
// export const createRegistration = async (req: Request, res: Response) => {
//   const { name, department, semester, eventId, userEmail } = req.body;
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyRegistrations = exports.getRegistrationsByEvent = exports.createRegistration = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Registration_1 = require("../models/Registration");
const Event_1 = require("../models/Event");
const generateQrToken_1 = require("../utils/generateQrToken");
const sendEmail_1 = require("../utils/sendEmail");
/* ================= CREATE REGISTRATION ================= */
const createRegistration = async (req, res) => {
    try {
        const { name, department, semester, eventId, userEmail } = req.body;
        if (!mongoose_1.default.isValidObjectId(eventId)) {
            return res.status(400).json({ message: "Invalid event ID" });
        }
        const event = await Event_1.Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        const existing = await Registration_1.Registration.findOne({ eventId, userEmail });
        if (existing) {
            return res.status(409).json({
                message: "You are already registered for this event",
            });
        }
        const qrToken = (0, generateQrToken_1.generateQrToken)();
        const registration = await Registration_1.Registration.create({
            name,
            department,
            semester,
            eventId,
            userEmail,
            qrToken,
            paymentStatus: event.isPaid ? "pending" : "free",
            paidAmount: event.isPaid ? event.amount : 0,
        });
        await (0, sendEmail_1.sendEmail)(userEmail, "Event Registration Successful", `
      <h2>Registration Confirmed</h2>
      <p><b>${event.name}</b></p>
      <p>Date: ${event.date}</p>
      <p>Venue: ${event.venue}</p>
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrToken}" />
      `);
        res.status(201).json({
            registrationId: registration._id,
            isPaid: event.isPaid,
            qrToken,
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.createRegistration = createRegistration;
/* ================= GET REGISTRATIONS BY EVENT ================= */
const getRegistrationsByEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        if (!mongoose_1.default.isValidObjectId(eventId)) {
            return res.status(400).json({ message: "Invalid event ID" });
        }
        const event = await Event_1.Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        const registrations = await Registration_1.Registration.find({ eventId })
            .sort({ createdAt: -1 })
            .lean();
        res.json({
            event: {
                id: event._id,
                name: event.name,
            },
            count: registrations.length,
            registrations,
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.getRegistrationsByEvent = getRegistrationsByEvent;
/* ================= GET MY REGISTRATIONS ================= */
const getMyRegistrations = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ message: "Email required" });
        }
        const registrations = await Registration_1.Registration.find({
            userEmail: email,
        })
            .populate("eventId")
            .sort({ createdAt: -1 });
        res.json(registrations);
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.getMyRegistrations = getMyRegistrations;
