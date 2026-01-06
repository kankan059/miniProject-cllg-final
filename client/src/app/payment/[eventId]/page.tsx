"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-slate-50 to-sky-50 text-slate-700 overflow-hidden px-4">
            {/* subtle noise */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />

            {/* soft blobs */}
            <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-sky-200/40 blur-3xl" />
            <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-200/40 blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="
        relative w-full max-w-md
        rounded-3xl
        border border-slate-200
        bg-white/90
        p-10
        shadow-[0_35px_90px_-30px_rgba(0,0,0,0.15)]
        backdrop-blur-xl
      "
            >
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-center text-3xl font-extrabold tracking-widest text-slate-800 mb-3"
                >
                    {event.name}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="text-center text-sm text-slate-500 mb-6"
                >
                    Complete your payment
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35, type: "spring", stiffness: 160 }}
                    className="mb-10 text-center"
                >
                    <span className="text-5xl font-bold text-sky-600">
                        ₹{event.amount}
                    </span>
                </motion.div>

                <motion.button
                    onClick={handlePayment}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="
          w-full rounded-2xl
          bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500
          py-4 text-lg font-bold tracking-widest text-white
          shadow-xl
          transition
        "
                >
                    PAY NOW
                </motion.button>

                <p className="mt-6 text-center text-xs text-slate-500">
                    Secure & encrypted payment
                </p>
            </motion.div>
        </div>
    );


}
