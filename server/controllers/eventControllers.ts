import { Request, Response } from "express";
import { Event } from "../models/Event"
export const getEvents = async (_req: Request, res: Response) => {
  const events = await Event.find().sort({ createdAt: -1 });
  res.json(events);
};

export const getEventById = async (req: Request, res: Response) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json(event);
};

export const createEvent = async (req: Request, res: Response) => {
  const { name, venue, date, description, isPaid, amount } = req.body;
  if (!name || !venue || !date || !description)
    return res.status(400).json({ message: "Missing fields" });

  const newEvent = new Event({ name, venue, date, description, isPaid, amount });
  await newEvent.save();
  res.status(201).json(newEvent);
};

export const updateEvent = async (req: Request, res: Response) => {
  const updated = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updated) return res.status(404).json({ message: "Event not found" });
  res.json(updated);
};

export const deleteEvent = async (req: Request, res: Response) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: "Event deleted" });
};
