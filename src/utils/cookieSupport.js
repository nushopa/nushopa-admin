// Returns true if the browser allows cookies for this site.
export const cookiesEnabled = () => {
  if (typeof navigator === "undefined" || !navigator.cookieEnabled) return false;
  try {
    document.cookie = "__cookie_test=1; path=/; SameSite=Lax";
    const ok = document.cookie.includes("__cookie_test=1");
    document.cookie = "__cookie_test=; path=/; Max-Age=0; SameSite=Lax";
    return ok;
  } catch {
    return false;
  }
};