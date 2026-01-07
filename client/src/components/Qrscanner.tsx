"use client";

import { QrReader } from "react-qr-reader";

export default function QrScanner({
  onScan,
}: {
  onScan: (token: string) => void;
}) {
  return (
    <div className="w-full max-w-sm mx-auto">
      <QrReader
        constraints={{ facingMode: "environment" }}
        onResult={(result, error) => {
          if (!!result) {
            onScan(result.getText());
          }
        }}
        className="w-full"
      />
    </div>
  );
}
