// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// import { Event } from "@/models/event";
// import { Registration } from "@/models/registration";
// import { User } from "@/models/user";
// import dbConnect from "@/lib/db";

// export async function POST(req: Request) {
//   await dbConnect();

//   // 🔐 session check
//   const session = await getServerSession(authOptions);
//   if (!session?.user?.email) {
//     return NextResponse.json(
//       { message: "Unauthorized" },
//       { status: 401 }
//     );
//   }

//   const body = await req.json();
//   const { eventId, name, department, semester } = body;

//   if (!eventId || !name || !department || !semester) {
//     return NextResponse.json(
//       { message: "Missing fields" },
//       { status: 400 }
//     );
//   }

//   // 🔍 user
//   const user = await User.findOne({ email: session.user.email });
//   if (!user) {
//     return NextResponse.json(
//       { message: "User not found" },
//       { status: 404 }
//     );
//   }

//   // 🔍 event
//   const event = await Event.findById(eventId);
//   if (!event || !event.isActive) {
//     return NextResponse.json(
//       { message: "Event not found" },
//       { status: 404 }
//     );
//   }

//   // 🛑 prevent duplicate registration
//   const already = await Registration.findOne({
//     eventId,
//     userId: user._id,
//   });

//   if (already) {
//     return NextResponse.json(
//       { message: "Already registered" },
//       { status: 409 }
//     );
//   }

//   // ✅ create registration
//   const registration = await Registration.create({
//     eventId,
//     userId: user._id,
//     name,
//     department,
//     semester,
//     paidAmount: event.isPaid ? event.amount : 0,
//     paymentStatus: event.isPaid ? "pending" : "paid",
//   });

//   return NextResponse.json({
//     registration,
//     requiresPayment: event.isPaid,
//   });
// }
