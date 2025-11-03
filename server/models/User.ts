
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    googleId?: string;
    role: 'attendee' | 'admin'; // Role simplified
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email:
    {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    googleId:
    {
        type: String,
        unique: true,
        sparse: true
    },
    role:
    {
        type: String,
        enum: ['attendee', 'admin'],
        default: 'attendee'
    },
}, { timestamps: true });

const User = mongoose.model<IUser>('User', UserSchema);
export default User;