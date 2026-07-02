import {Device} from "../../../shared/types/Device";

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

export async function fetchDevices(): Promise<Response> {
    return _apiFetch("/api/me/player/devices");
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


export async function startPlayback(uris: string[], deviceId?: string): Promise<Response> {
    return await _apiFetch("/api/me/player/play", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ uris, deviceId }),
    });
}

export async function transferPlayback(deviceId: string, play?: boolean): Promise<Response> {
    return await _apiFetch("/api/me/player/play", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ deviceId, play }),
    });
}

// Look for devices before attempting to start playback.
export async function attemptPlayback(uris: string[]): Promise<Response> {
    const {devices} = await (await fetchDevices()).json();

    if (devices.length > 0) {
        // Favor active device
        const device: Device = devices.find((d: Device) => d.is_active) ?? devices[0];
        return startPlayback(uris, device.id);
    }

    // Last ditch effort to start playback
    return startPlayback(uris);
}

export async function logOut(): Promise<Response> {
    return await _apiFetch("/logout", {method: "POST"});
}