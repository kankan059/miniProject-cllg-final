import { Schema, model } from "mongoose";

const RegistrationSchema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    userEmail: {
      type: String,
      required: true,
    },

    name: String,
    department: String,
    semester: String,

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "free"],
      default: "pending",
    },
    qrToken: { type: String, unique: true },
    checkInAt: {
      type: Date,
      default: null,
    },
    paidAmount: Number,
  },
  { timestamps: true }
);

RegistrationSchema.index({ eventId: 1, userEmail: 1 }, { unique: true });

export const Registration = model("Registration", RegistrationSchema);
