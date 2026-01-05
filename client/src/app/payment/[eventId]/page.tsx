"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function PaymentPage() {
    const { eventId } = useParams();
    const router = useRouter();
    const [event, setEvent] = useState<any>(null);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}`)
            .then(res => res.json())
            .then(data => setEvent(data));
    }, [eventId]);

    const handlePayment = async () => {
        const orderRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/payment/create-order`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventId, userEmail: localStorage.getItem("userEmail") }),

            }
        );

        const order = await orderRes.json();
        if (!orderRes.ok) {
            alert(order.message);
            return;
        }
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: "INR",
            name: event.name,
            description: "Event Registration",
            order_id: order.order_id, //  MUST

            handler: async function (response: any) {
                const verifyRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/payment/verify`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,

                            eventId,
                            name: localStorage.getItem("name"),
                            department: localStorage.getItem("department"),
                            semester: localStorage.getItem("semester"),
                            userEmail: localStorage.getItem("userEmail"),
                        }),
                    }
                );

                const data = await verifyRes.json();

                //  IMPORTANT CONDITION
                if (!verifyRes.ok) {
                    alert(data.message || "Payment verified but registration failed");
                    return;
                }

                alert("Payment successful & registered!");
                localStorage.clear();
                router.push("/");
            },

            modal: {
                ondismiss: function () {
                    alert("Payment cancelled");
                },
            },
        };

        new window.Razorpay(options).open();
    };

    if (!event) return <p>Loading...</p>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-orange-400">
            <div className="border border-orange-400 p-6 rounded">
                <h1 className="text-xl font-bold">{event.name}</h1>
                <p className="my-3">Amount: ₹{event.amount}</p>
                <button
                    onClick={handlePayment}
                    className="bg-orange-400 text-black px-4 py-2 rounded hover:bg-orange-500 active:bg-amber-900 cursor-pointer"
                >
                    Pay Now
                </button>
            </div>
        </div>
    );
}
