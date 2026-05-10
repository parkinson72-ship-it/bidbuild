"use client";

import { useEffect } from "react";

export default function MarkMessagesRead({ jobId }: { jobId: string }) {
  useEffect(() => {
    fetch(`/api/jobs/${jobId}/messages/read`, {
      method: "POST"
    });
  }, [jobId]);

  return null;
}
