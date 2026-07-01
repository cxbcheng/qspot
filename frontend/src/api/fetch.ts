// Helper function to fetch from API endpoints.
async function _apiFetch(path: string, init?: RequestInit): Promise<Response> {
    if (!path.startsWith("/")) {
        throw new Error("Path should be an absolute path starting with '/'.");
    }

    return fetch(`${import.meta.env.VITE_BACKEND_URI}${path}`, {
        credentials: "include",
        ...init,
    });
}

export async function fetchProfile(): Promise<Response> {
    return _apiFetch("/api/me");
}

export async function fetchPlaylists(): Promise<Response> {
    return _apiFetch("/api/me/playlists");
}