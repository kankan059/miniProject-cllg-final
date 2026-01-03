import { Schema, models, model } from "mongoose";

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
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    department: { type: String, required: true },
    semester: { type: String, required: true },
    paidAmount: Number,
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

RegistrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });

export const Registration =
  models.Registration || model("Registration", RegistrationSchema);