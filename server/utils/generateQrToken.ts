import crypto from "crypto";

export function generateQrToken() {
  return crypto.randomBytes(20).toString("hex");
}
