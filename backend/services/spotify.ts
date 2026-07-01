import {UserProfile} from "../../shared/types/UserProfile";
import {Playlist, Playlists} from "../../shared/types/Playlist";

const SPOTIFY_API = "https://api.spotify.com/v1";

async function _spotifyFetch(accessToken: string, path: string, init?: RequestInit): Promise<Response> {
    if (!accessToken) {
        throw new Error("No access token");
    }

    const response = await fetch(`${SPOTIFY_API}${path}`, {
        ...init,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            ...(init?.headers ?? {}),
        },
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Spotify returned ${response.status}: ${error}`);
    }

    return response;
}

async function _spotifyFetchJson<T>(accessToken: string, path: string, init?: RequestInit): Promise<T> {
    const response = await _spotifyFetch(accessToken, path, init);
    return await response.json() as Promise<T>;
}

export function getProfile(accessToken: string): Promise<UserProfile> {
    return _spotifyFetchJson<UserProfile>(accessToken, "/me");
}

export function getUserPlaylists(accessToken: string): Promise<Playlists> {
    return _spotifyFetchJson<Playlists>(accessToken, "/me/playlists");
}

export function getPlaylist(accessToken: string, playlistId: string): Promise<Playlist> {
    return _spotifyFetchJson(accessToken, `/playlists/${playlistId}`);
}

export function createPlaylist(
    accessToken: string,
    name: string,
    description: string,
    isPublic: boolean): Promise<any> {
    return _spotifyFetchJson(accessToken, "/me/playlists", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            description,
            public: isPublic,
        }),
    });
}

/**
 * Spotify rate limits adding tracks to playlists to 100 tracks per request.
 */
async function _addTracksToPlaylist100(
    accessToken: string,
    playlistId: string,
    uris: string[]
): Promise<any> {
    return _spotifyFetchJson(accessToken, `/playlists/${playlistId}/items`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ uris }),
    });
}

/**
 * Spotify rate limits adding tracks to playlists to 100 tracks per request.
 * This works around rate limits by chunking.
 */
export async function addTracksToPlaylist(
    accessToken: string,
    playlistId: string,
    uris: string[]
): Promise<void> {
    for (let i = 0; i < uris.length; i += 100) {
        const chunk: string[] = uris.slice(i, i + 100);
        await _addTracksToPlaylist100(accessToken, playlistId, chunk);
    }
}

export function getPlaylistImages(
    accessToken: string,
    playlistId: string
): Promise<any> {
    return _spotifyFetchJson(accessToken, `/playlists/${playlistId}/images`);
}

export async function setPlaylistImage(
    accessToken: string,
    playlistId: string,
    base64Jpeg: string,
): Promise<void> {
    await _spotifyFetch(accessToken, `/playlists/${playlistId}/images`, {
        method: "PUT",
        headers: {"Content-Type": "image/jpeg"},
        body: base64Jpeg,
    });
}

/**
 * Copies a playlist cover image from one playlist to another.
 */
export async function copyPlaylistImage(
    accessToken: string,
    sourcePlaylistId: string,
    destinationPlaylistId: string
) {
    const images = await getPlaylistImages(accessToken, sourcePlaylistId);
    if (!images.length) return;

    const imageUrl = images[0].url;
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) throw new Error("Failed to download playlist image");

    const buffer = Buffer.from(await imageResponse.arrayBuffer());

    const base64Image = buffer.toString("base64");
    await setPlaylistImage(accessToken, destinationPlaylistId, base64Image);
}

export async function addToQueue(
    accessToken: string,
    uri: string,
): Promise<void> {
    await _spotifyFetch(
        accessToken,
        `/me/player/queue?uri=${encodeURIComponent(uri)}`,
        {
            method: "POST",
        },
    );
}

export async function addTracksToQueue(accessToken: string, uris: string[]): Promise<void> {
    for (const uri of uris) {
        await addToQueue(accessToken, uri);
    }
}

export async function startPlayback(
    accessToken: string,
    uris: string[],
): Promise<void> {
    await _spotifyFetch(accessToken, "/me/player/play", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ uris }),
    });
}