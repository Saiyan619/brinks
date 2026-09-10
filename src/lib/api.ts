const defaultApiBaseUrl = "http://localhost:8000/api";

export const API_BASE_URL = (
    import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl
).replace(/\/$/, "");

export const apiUrl = (path: string) => `${API_BASE_URL}/${path.replace(/^\//, "")}`;

export const websocketUrl = (path: string) =>
    apiUrl(path).replace(/^http/, "ws");