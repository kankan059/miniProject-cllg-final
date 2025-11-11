import { Schema, models, model } from "mongoose";

const EventSchema = new Schema(
  {
    name: { type: String, required: true },
    venue: { type: String, required: true },
    date: { type: String, required: true }, // ISO date string
    description: { type: String, required: true },
    isPaid: { type: Boolean, default: false },
    amount: { type: Number },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Event = models.Event || model("Event", EventSchema);
