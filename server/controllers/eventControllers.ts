import { Request, Response } from 'express';
import Event, { IEvent } from '../models/Event';
import { IUser } from '../models/User';


interface AuthRequest extends Request {
    user?: IUser; 
}


//  GET: Saare Events Fetch Karna (Public)
export const getEvents = async (req: Request, res: Response) => {
    try {
        //  active events shows
        const events = await Event.find({ isActive: true })
            .select('title date location price isPaid capacity ticketsSold')
            .sort({ date: 1 }); //soring by date

        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: 'Server Error: Events could not be retrieved.' });
    }
};


// single event fetch 
export const getEventById = async (req: Request, res: Response) => {
    try {
        const event = await Event.findById(req.params.id)
            .select('-__v -updatedAt')
            .populate('organizer', 'name email'); 
        if (!event || !event.isActive) {
            return res.status(404).json({ message: 'Event not found or is inactive.' });
        }

        res.status(200).json(event);
    } catch (error) {
        res.status(400).json({ message: 'Invalid Event ID format.' });
    }
};


// POST:
export const createEvent = async (req: AuthRequest, res: Response) => {
   
    const organizerId = req.body.organizerId || '60c72b2f9c1d440000000001'; // Placeholder ID

    const { title, description, date, location, price, capacity } = req.body;

    // Basic Validation
    if (!title || !date || !location || !capacity) {
        return res.status(400).json({ message: 'Please fill all required fields: title, date, location, capacity.' });
    }

    try {
        const newEvent = new Event({
            title,
            description,
            date: new Date(date), 
            location,
            price: price || 0,
            capacity,
            organizer: organizerId,
            isPaid: (price > 0), 
        });

        const savedEvent = await newEvent.save();
        res.status(201).json({ 
            message: 'Event created successfully!',
            event: savedEvent 
        });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: 'Server Error: Event creation failed.' });
    }
};

// PUT/PATCH:
export const updateEvent = async (req: AuthRequest, res: Response) => {    
    try {
        const eventId = req.params.id;
        const updateData = req.body;

        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            { 
                ...updateData,
                ...(updateData.price !== undefined && { isPaid: updateData.price > 0 }) 
            },
            { new: true, runValidators: true } 
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        res.status(200).json({
            message: 'Event updated successfully!',
            event: updatedEvent
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error: Failed to update event.' });
    }
};

// DELETE: 
export const deleteEvent = async (req: AuthRequest, res: Response) => {
    
    try {
        const eventId = req.params.id;

        const result = await Event.findByIdAndUpdate(
            eventId,
            { isActive: false },
            { new: true }
        );
        
        if (!result) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        res.status(200).json({ message: 'Event successfully deactivated.' });

    } catch (error) {
        res.status(500).json({ message: 'Server Error: Failed to deactivate event.' });
    }
};