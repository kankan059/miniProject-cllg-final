
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function fetchEvents() {
  const res = await fetch(`${BASE_URL}/api/events`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load events");
  return res.json();
}

export async function addEvent(data: any) {
  const res = await fetch(`${BASE_URL}/api/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add event");
  return res.json();
}

export async function updateEvent(id: string, data: any) {
  const res = await fetch(`${BASE_URL}/api/events/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update event");
  return res.json();
}

export async function deleteEvent(id: string) {
  const res = await fetch(`${BASE_URL}/api/events/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete event");
  return res.json();
}

export async function loginUser(data: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function registerUser(data: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchRegistrationsByEvent(eventId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/registrations/event/${eventId}`,
    {
      method: "GET",
      credentials: "include", 
    }
  );

  console.log("STATUS ", res.status);

  if (!res.ok) {
    const text = await res.text();
    console.log("ERROR BODY ", text);
    throw new Error("Failed to load registrations");
  }

  return res.json();
}



export async function fetchAttendanceSummary(eventId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/attendance/summury/${eventId}`,
    {
      credentials: "include", // NextAuth cookie
    }
  );

  if (!res.ok) {
    throw new Error("Failed to load attendees");
  }

  return res.json();
}


export async function getUserFromDB() {
  const email = cookies().get("user_email")?.value
  if (!email) return null

  return await db.user.findUnique({
    where: { email },
    select: { id: true, role: true }
  })
}