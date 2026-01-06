// import { Request, Response } from "express";
// import { Registration } from "../models/Registration";
// import { Event } from "../models/Event";
// import mongoose from "mongoose";
// import { generateQrToken } from "../utils/generateQrToken";
// import { sendEmail } from "../utils/sendEmail";
// export const createRegistration = async (req: Request, res: Response) => {
//   const { name, department, semester, eventId, userEmail } = req.body;

//   const qrToken = generateQrToken(); //yat geneerate hobo qr code

//   const event = await Event.findById(eventId);
//   if (!event) return res.status(404).json({ message: "Event not found" });

//   const alreadyRegistered = await Registration.findOne({
//     eventId,
//     userEmail,
//   });

//   if (alreadyRegistered) {
//     return res.status(409).json({
//       message: "You are already registered for this event",
//     });
//   }
//   const registration = await Registration.create({
//     name,
//     department,
//     semester,
//     eventId,
//     userEmail,
//     qrToken,
//     paymentStatus: event.isPaid ? "pending" : "free",
//     paidAmount: event.isPaid ? event.amount : 0,
//   });

//   await sendEmail(
//     userEmail,
//     "🎉 Event Registration Successful",
//     `
//     <h2>Registration Confirmed</h2>
//     <p>You are successfully registered for:</p>
//     <p><b>${event.name}</b></p>
//     <p>Date: ${event.date}</p>
//     <p>Venue: ${event.venue}</p>

//     ${registration.qrToken
//       ? `<p>Show this QR at entry:</p>
//            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${registration.qrToken}" />`
//       : ""
//     }

//     <p>Thank you </p>
//   `
//   );


//   res.status(201).json({
//     registrationId: registration._id,
//     isPaid: event.isPaid,
//     qrToken
//   });
// };


// export const getRegistrationsByEvent = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const { eventId } = req.params;

//     //Validate ObjectId
//     if (!mongoose.Types.ObjectId.isValid(eventId)) {
//       return res.status(400).json({ message: "Invalid event ID" });
//     }

//     //Check event exists
//     const event = await Event.findById(eventId);
//     if (!event) {
//       return res.status(404).json({ message: "Event not found" });
//     }

//     // Fetch registrations
//     const registrations = await Registration.find({ eventId })
//       .sort({ createdAt: -1 })
//       .lean();

//     //Response
//     res.json({
//       event: {
//         id: event._id,
//         name: event.name,
//       },
//       count: registrations.length,
//       registrations,
//     });
//   } catch (error) {
//     console.error("GET REGISTRATIONS ERROR:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };




// export const getMyRegistrations = async (req: Request, res: Response) => {
//   try {
//     const { email } = req.query;

//     if (!email) {
//       return res.status(400).json({ message: "Email required" });
//     }

//     const registrations = await Registration.find({ userEmail: email })
//       .populate("eventId")
//       .sort({ createdAt: -1 });

//     res.json(registrations);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
import { Request, Response } from "express";
import mongoose from "mongoose";
import { Registration } from "../models/Registration";
import { Event } from "../models/Event";
import { generateQrToken } from "../utils/generateQrToken";
import { sendEmail } from "../utils/sendEmail";

export const createRegistration = async (req: Request, res: Response) => {
  try {
    const { name, department, semester, eventId, userEmail } = req.body;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const alreadyRegistered = await Registration.findOne({
      eventId,
      userEmail,
    });

    if (alreadyRegistered) {
      return res.status(409).json({
        message: "You are already registered for this event",
      });
    }

    const qrToken = generateQrToken();

    const registration = await Registration.create({
      name,
      department,
      semester,
      eventId,
      userEmail,
      qrToken,
      paymentStatus: event.isPaid ? "pending" : "free",
      paidAmount: event.isPaid ? event.amount : 0,
    });

    await sendEmail(
      userEmail,
      "Event Registration Successful",
      `
      <h2>Registration Confirmed</h2>
      <p><b>${event.name}</b></p>
      <p>Date: ${event.date}</p>
      <p>Venue: ${event.venue}</p>
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrToken}" />
    `
    );

    res.status(201).json({
      registrationId: registration._id,
      isPaid: event.isPaid,
      qrToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getRegistrationsByEvent = async (
  req: Request,
  res: Response
) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const registrations = await Registration.find({ eventId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      event: {
        id: event._id,
        name: event.name,
      },
      count: registrations.length,
      registrations,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyRegistrations = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const registrations = await Registration.find({
      userEmail: email,
    })
      .populate("eventId")
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
