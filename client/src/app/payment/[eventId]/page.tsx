"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Event {
    _id: string;
    name: string;
    amount: number;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function PaymentPage() {
    const params = useParams();
    const eventId = params?.eventId as string;
    const router = useRouter();

    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(false);
    console.log("EVENT ID BEFORE FETCH 👉", eventId);

    // Fetch event info
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}`)
            .then(res => res.json())
            .then(data => setEvent(data));
    }, [eventId]);

    async function handlePayment() {
        if (!event) return;
        setLoading(true);

        // 1️⃣ Create order from backend

        const orderRes = await fetch(
            
            `${process.env.NEXT_PUBLIC_API_URL}/api/payment/create-order`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: event.amount,
                    eventId: event._id,
                }),
            }
        );

        const order = await orderRes.json();

        // Open Razorpay
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
            amount: order.amount,
            currency: "INR",
            name: event.name,
            description: "Event Registration",
            order_id: order.id,

            handler: async function (response: any) {
                // Verify payment
                await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/payment/verify`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            ...response,
                            eventId: event._id,
                        }),
                    }
                );

                alert("Payment successful!");
                router.push("/");
            },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();

        setLoading(false);
    }

    if (!event)
        return <p className="text-center text-orange-400">Loading payment...</p>;

    return (
        <div className="min-h-screen bg-black text-orange-400 flex items-center justify-center">
            <div className="border border-orange-400 p-6 rounded-xl max-w-sm w-full">
                <h1 className="text-xl font-bold mb-3">{event.name}</h1>
                <p className="mb-4">Amount: ₹{event.amount}</p>

                <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full bg-orange-400 text-black py-2 rounded-lg font-semibold"
                >
                    {loading ? "Processing..." : "Pay Now"}
                </button>
            </div>
        </div>
    );
}
