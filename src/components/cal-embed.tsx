"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export function CalEmbed() {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: "30min" });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);
  return (
    <div className="min-h-[620px] overflow-hidden rounded-xl border border-border">
      <Cal
        namespace="30min"
        calLink="eyup-poyraz-mb4tp0/30min"
        style={{ width: "100%", height: "100%", minHeight: 620 }}
        config={{ layout: "month_view" }}
      />
    </div>
  );
}
