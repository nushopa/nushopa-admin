import { useState } from "react";
import { registerWebPush } from "../../lib/pushNotifications";

export default function EnablePushNotifications() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const enable = async () => {
    setBusy(true);
    setMessage("");
    try {
      await registerWebPush();
      setMessage("Push notifications are enabled on this device.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Push setup failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={enable}
        disabled={busy}
        className="rounded-lg bg-mainGreen px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {busy ? "Enabling..." : "Enable push notifications"}
      </button>
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </div>
  );
}
