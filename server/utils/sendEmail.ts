// utils/sendEmail.ts
import { google } from "googleapis";

// create ONCE (global)
const oAuth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

// create ONCE (global)
const gmail = google.gmail({
  version: "v1",
  auth: oAuth2Client,
});

export async function sendEmail(
  to: string,
  subject: string,
  html: string
) {
  try {
    const message = [
      `From: Event Manager <${process.env.GMAIL_USER}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      "Content-Type: text/html; charset=utf-8",
      "",
      html,
    ].join("\n");

    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: encodedMessage },
    });

    console.log("Email sent");
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("Email error (ignored):", error.message);
  }
}
