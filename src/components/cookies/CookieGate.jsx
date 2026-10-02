import { useMemo } from "react";
import { cookiesEnabled } from "../../utils/cookieSupport";

// Render once near the app root. Shows a banner if cookies are disabled.
export default function CookieGate() {
  const enabled = useMemo(() => cookiesEnabled(), []);
  if (enabled) return null;

  return (
    <div
      role="alert"
      style={{
        background: "#fff3cd",
        color: "#664d03",
        padding: "12px 16px",
        textAlign: "center",
        fontSize: 14,
      }}
    >
      Cookies are disabled in your browser. Please enable cookies for this site
      so you can log in.
    </div>
  );
}