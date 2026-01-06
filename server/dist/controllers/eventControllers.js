"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getEventById = exports.getEvents = void 0;
const Event_1 = require("../models/Event");
const getEvents = async (_req, res) => {
    const events = await Event_1.Event.find().sort({ createdAt: -1 });
    res.json(events);
};
exports.getEvents = getEvents;
const getEventById = async (req, res) => {
    const event = await Event_1.Event.findById(req.params.id);
    if (!event)
        return res.status(404).json({ message: "Event not found" });
    res.json(event);
};
exports.getEventById = getEventById;
const createEvent = async (req, res) => {
    const { name, venue, date, description, isPaid, amount } = req.body;
    if (!name || !venue || !date || !description)
        return res.status(400).json({ message: "Missing fields" });
    const newEvent = new Event_1.Event({ name, venue, date, description, isPaid, amount });
    await newEvent.save();
    res.status(201).json(newEvent);
};
exports.createEvent = createEvent;
const updateEvent = async (req, res) => {
    const updated = await Event_1.Event.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    if (!updated)
        return res.status(404).json({ message: "Event not found" });
    res.json(updated);
};
exports.updateEvent = updateEvent;
const deleteEvent = async (req, res) => {
    await Event_1.Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
};
exports.deleteEvent = deleteEvent;
