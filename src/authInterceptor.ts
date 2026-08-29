import axios from "axios";
import Cookies from "js-cookie";

// A 401 from the backend means the token cookie is missing, invalid, or was signed with a key
// the backend no longer recognizes (e.g. a redeploy that rotates the JWT secret invalidates
// every token issued before it, regardless of that token's own claimed expiry). Every component
// that makes an authenticated call used to just log the error to the console and stop - the
// token cookie stayed put, so the UI kept looking logged-in while every real request silently
// failed underneath it.
//
// Registered once here (as a side-effect import in main.tsx) on the shared default axios
// instance, so it runs for every request made anywhere in the app, not just ones that remember
// to opt in. Mirrors LayoutHeader's own logOut() exactly - same cookie value, same navigation -
// so a forced logout looks identical to a real one.
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = Cookies.get("token");
    if (error.response?.status === 401 && token && token !== "logout") {
      Cookies.set("token", "logout", { secure: true, sameSite: "Strict" });
      // A plain reload (rather than a router navigate) also resets any in-memory Redux/component
      // state built on the now-invalid session - the same reason LayoutHeader's logOut() reloads
      // instead of just navigating.
      if (window.location.pathname === "/home") {
        window.location.reload();
      } else {
        window.location.href = "/home";
      }
    }
    return Promise.reject(error);
  }
);
