// server/models/Booking.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
    user: mongoose.Schema.Types.ObjectId;
    event: mongoose.Schema.Types.ObjectId;
    ticketQuantity: number;
    totalAmount: number;
    
    // 💡 Payment Tracking for Razorpay
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled';
    razorpayOrderId?: string; // Razorpay se mila Order ID
    razorpayPaymentId?: string; // Successful payment ke baad Payment ID
    
    // QR Attendance System
    attendanceCode: string;
    attended: boolean;

    // 💡 Email & Calendar Tracking
    emailConfirmationSent: boolean; // Registration ke baad
    emailReminderSent: boolean;     // Event day se pehle
    
    bookingDate: Date;
}

const BookingSchema: Schema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    
    ticketQuantity: { type: Number, required: true, min: 1 },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentStatus: { 
        type: String, 
        enum: ['pending', 'paid', 'failed', 'refunded', 'cancelled'], 
        default: 'pending' 
    },
    
    // Razorpay Fields
    razorpayOrderId: { type: String, sparse: true },
    razorpayPaymentId: { type: String, sparse: true },

    // QR/Attendance Fields
    attendanceCode: { type: String, unique: true, required: true },
    attended: { type: Boolean, default: false },
    
    // Email Tracking Fields
    emailConfirmationSent: { type: Boolean, default: false },
    emailReminderSent: { type: Boolean, default: false },

}, { timestamps: true });

const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
export default Booking;