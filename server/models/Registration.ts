// models/Registration.ts
import { Schema, models, model } from "mongoose";

const RegistrationSchema = new Schema(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    department: String,
    semester: String,
    paidAmount: Number,
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    qrCode: String, // data URL or token
    checkInAt: Date,
  },
  { timestamps: true }
);

export const Registration =
  models.Registration || model("Registration", RegistrationSchema);
