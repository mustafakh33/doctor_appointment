import axios from "axios";

const STORAGE_KEY = "doctor_appointment_token";
const AUTH_SESSION_KEY = "doctor_appointment_auth";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        let token = window.localStorage.getItem(STORAGE_KEY);

        // Backward-safe fallback: recover token from persisted auth session.
        if (!token) {
            const rawSession = window.localStorage.getItem(AUTH_SESSION_KEY);

            if (rawSession) {
                try {
                    const parsedSession = JSON.parse(rawSession);
                    const recoveredToken = parsedSession?.token || "";

                    if (recoveredToken) {
                        token = recoveredToken;
                        window.localStorage.setItem(STORAGE_KEY, recoveredToken);
                    }
                } catch {
                    // Ignore malformed cached session and proceed without token.
                }
            }
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }

    return config;
});

export const authStorage = {
    tokenKey: STORAGE_KEY,
    authKey: "doctor_appointment_auth",
};

export default api;