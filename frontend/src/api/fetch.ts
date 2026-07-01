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

export async function fetchPlaylist(playlistId: string): Promise<Response> {
    return _apiFetch(`/api/playlists/${playlistId}`);
}

export async function createShuffledPlaylist(
    playlistId: string,
    uris: string[],
): Promise<Response> {
    return _apiFetch(`/api/playlists/${playlistId}/create-shuffle`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ uris }),
    });
}


export async function startPlayback(uris: string[]): Promise<Response> {
    return await _apiFetch("/api/me/player/play", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ uris }),
    });
}

export async function logOut(): Promise<Response> {
    return await _apiFetch("/logout", {method: "POST"});
}