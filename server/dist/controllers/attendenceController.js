"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttendanceSummary = exports.scanQr = void 0;
const Registration_1 = require("../models/Registration");
const scanQr = async (req, res) => {
    const { qrToken } = req.body;
    if (!qrToken) {
        return res.status(400).json({ message: "QR token missing" });
    }
    const registration = await Registration_1.Registration.findOne({ qrToken });
    if (!registration) {
        return res.status(404).json({ message: "Invalid QR" });
    }
    if (registration.checkInAt) {
        return res.status(409).json({
            message: `Already checked in at ${registration.checkInAt}`,
        });
    }
    //  MARK ATTENDANCE
    registration.checkInAt = new Date();
    await registration.save();
    return res.json({
        message: "Attendance marked",
        attendee: {
            name: registration.name,
            email: registration.userEmail,
            time: registration.checkInAt,
        },
    });
};
exports.scanQr = scanQr;
const getAttendanceSummary = async (req, res) => {
    try {
        const { eventId } = req.params;
        console.log(eventId);
        const attendees = await Registration_1.Registration.find({
            eventId,
            checkInAt: { $ne: null }, //  scanned users only
        }).select("name department userEmail semester checkInAt");
        res.json({
            totalAttended: attendees.length,
            attendees,
        });
    }
    catch (err) {
        console.error("ATTENDANCE SUMMARY ERROR", err);
        res.status(500).json({ message: "Failed to load attendance" });
    }
};
exports.getAttendanceSummary = getAttendanceSummary;
