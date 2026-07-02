import {Device} from "../../../shared/types/Device";
import {redirect} from "react-router";

interface ApiOptions extends RequestInit {
    // Callback for each status number. Use "*" as the key for a generic status handler.
    statusHandlers?: {
        [statusCode: number]: (res: Response) => void | Promise<void>;
        "*"?: (res: Response) => void | Promise<void>;
    };
}

// Helper function to fetch from API endpoints.
async function _apiFetch(path: string, options?: ApiOptions): Promise<Response> {
    if (!path.startsWith("/")) {
        throw new Error("Path should be an absolute path starting with '/'.");
    }

    const { statusHandlers, ...init } = options || {};
    const url = `${import.meta.env.VITE_BACKEND_URI}${path}`;

    const res = await fetch(url, {
        credentials: "include",
        ...init,
    });

    if (statusHandlers && statusHandlers[res.status]) {
        await statusHandlers[res.status](res);
        return res;
    }

    if (statusHandlers && statusHandlers["*"]) {
        await statusHandlers["*"](res);
        return res;
    }

    // Status handling
    if (res.status === 401) {
        throw redirect('/login');
    }

    if (res.status === 403) {
        throw redirect('/setup/spotify');
    }

    if (res.status === 429) {
        const retryHeader = res.headers.get("Retry-After");
        const retrySecs = retryHeader ? parseInt(retryHeader, 10) : 10;

        if (retrySecs <= 3) {
            await new Promise((resolve) => setTimeout(resolve, retrySecs * 1000));
            return _apiFetch(path, options); // Try again
        }

        // Throw to ErrorBoundary
        throw new Response(JSON.stringify({ retrySecs }), {
            status: 429,
            headers: { "Content-Type": "application/json" }
        });
    }

    if (!res.ok && res.status >= 500) {
        throw new Response("Interval Server Error", { status: res.status });
    }

    return res;
}

export async function fetchProfile(options?: ApiOptions): Promise<Response> {
    return _apiFetch("/api/me", options);
}

export async function fetchPlaylists(offset: number = 0, limit: number = 50, options?: ApiOptions): Promise<Response> {
    return _apiFetch(`/api/me/playlists?offset=${offset}&limit=${limit}`, options);
}

export async function fetchPlaylist(playlistId: string, options?: ApiOptions): Promise<Response> {
    return _apiFetch(`/api/playlists/${playlistId}`, options);
}

export async function fetchDevices(options?: ApiOptions): Promise<Response> {
    return _apiFetch("/api/me/player/devices", options);
}

export async function createShuffledPlaylist(
    playlistId: string,
    uris: string[],
    options?: ApiOptions
): Promise<Response> {
    return _apiFetch(`/api/playlists/${playlistId}/create-shuffle`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ uris }),
        ...options
    });
}


export async function startPlayback(uris: string[], deviceId?: string, options?: ApiOptions): Promise<Response> {
    return await _apiFetch("/api/me/player/play", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ uris, deviceId }),
        ...options
    });
}

export async function transferPlayback(deviceId: string, play?: boolean, options?: ApiOptions): Promise<Response> {
    return await _apiFetch("/api/me/player/play", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ deviceId, play }),
        ...options,
    });
}

// Look for devices before attempting to start playback.
export async function attemptPlayback(uris: string[], options?: ApiOptions): Promise<Response> {
    const {devices} = await (await fetchDevices(options)).json();

    if (devices.length > 0) {
        // Favor active device
        const device: Device = devices.find((d: Device) => d.is_active) ?? devices[0];
        return startPlayback(uris, device.id, options);
    }

    // Last ditch effort to start playback
    return startPlayback(uris, undefined, options);
}

export async function logOut(): Promise<Response> {
    return await _apiFetch("/logout", {method: "POST"});
}