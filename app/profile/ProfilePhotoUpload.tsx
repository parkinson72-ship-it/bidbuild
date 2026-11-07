"use client";

import { useState } from "react";

export default function ProfilePhotoUpload({
  currentImage,
}: {
  currentImage?: string | null;
}) {
  const [image, setImage] = useState<string | null>(currentImage ?? null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setMessage("");
    const body = new FormData();
    body.append("file", file);
    try {
      const res = await fetch("/api/profile/photo", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Upload failed");
      } else {
        setImage(data.url);
        setMessage("Photo updated");
      }
    } catch {
      setMessage("Upload failed");
    }
    setBusy(false);
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1rem 0" }}>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt="Profile photo"
          style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover" }}
        />
      ) : (
        <div
          style={{ width: 96, height: 96, borderRadius: "50%", background: "#e5e5e5" }}
        />
      )}
      <div>
        <label style={{ fontWeight: "bold" }}>
          {image ? "Change photo" : "Upload photo"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onChange}
            disabled={busy}
            style={{ display: "block", marginTop: "0.25rem" }}
          />
        </label>
        {busy && <p>Uploading…</p>}
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
