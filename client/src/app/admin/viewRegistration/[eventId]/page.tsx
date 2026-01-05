"use client";

import { useParams } from "next/navigation";
import EventRegistrations from "@/app/admin/components/EventRegistration";
import Attendes from "@/app/admin/components/Attendes";
import { useEffect, useState } from "react";

export default function ViewRegistrationPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const [eventName, setEventName] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}`)
      .then(res => res.json())
      .then(data => setEventName(data.name));
  }, [eventId]);
  return (
    <>
      <EventRegistrations
        eventId={eventId}
        eventName={eventName}
      />

      <Attendes
        eventId={eventId}
        eventName={eventName}
      />
    </>
  );
}
