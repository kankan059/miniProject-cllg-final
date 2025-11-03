// server/models/Event.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
    title: string;
    description: string;
    date: Date;
    location: string;
    price: number;
    capacity: number;
    ticketsSold: number;
    organizer: mongoose.Schema.Types.ObjectId;
    isPaid: boolean; // 💡 New: Kya event mein payment required hai?
    isActive: boolean;
}

const EventSchema: Schema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    
    // Price and Payment Check
    price: { type: Number, default: 0, min: 0 },
    isPaid: { type: Boolean, default: false }, // Agar price > 0 ho toh isko true set kar sakte hain
    
    capacity: { type: Number, required: true, min: 1 },
    ticketsSold: { type: Number, default: 0, min: 0 },
    
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Event = mongoose.model<IEvent>('Event', EventSchema);
export default Event;