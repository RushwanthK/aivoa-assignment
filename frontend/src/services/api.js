import axios from "axios";

// Backend URL comes from the build environment (VITE_API_URL), e.g. on Vercel.
// Falls back to the local FastAPI server for development.
const baseURL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

const api = axios.create({
    baseURL,
    // Free-tier hosts can take up to a minute to wake the backend.
    timeout: 90_000,
});

// Turn an axios error into a message that is safe to show the user.
export function getErrorMessage(err, fallback = "Something went wrong.") {
    if (err?.code === "ECONNABORTED") {
        return "The server took too long to respond. It may be waking up; please try again.";
    }
    if (!err?.response) {
        return "Can't reach the server. It may be waking up; please try again in a moment.";
    }
    if (err.response.status === 429) {
        return "Too many requests. Please wait a minute and try again.";
    }
    const detail = err.response.data?.detail;
    if (typeof detail === "string") {
        return detail;
    }
    if (Array.isArray(detail) && detail[0]?.msg) {
        return detail[0].msg;
    }
    return fallback;
}

export default api;
