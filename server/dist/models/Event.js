"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const mongoose_1 = require("mongoose");
const EventSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    venue: { type: String, required: true },
    date: { type: String, required: true }, // ISO date string
    description: { type: String, required: true },
    isPaid: { type: Boolean, default: false },
    amount: { type: Number },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
exports.Event = mongoose_1.models.Event || (0, mongoose_1.model)("Event", EventSchema);
