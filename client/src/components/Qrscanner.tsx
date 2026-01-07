"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

export default function QRScanner({ onScan }: { onScan: (text: string) => void }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      (decodedText) => {
        onScan(decodedText);
        scanner.clear();
      },
      (error) => {
        console.warn(error);
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return <div id="reader" />;
}
