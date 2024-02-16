export const BASE_URL =
    window.location.hostname === "localhost"
        ? "https://localhost:8080"
        : `${window.location.protocol}//${window.location.host}/`;
