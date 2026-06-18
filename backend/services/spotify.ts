import {UserProfile} from "../../shared/types/UserProfile";
import {Playlists} from "../../shared/types/Playlist";

export async function getProfile(accessToken: string): Promise<UserProfile> {
    if (!accessToken) throw new Error("No access token");

    const response: Response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const error: string = await response.text();
        throw new Error(`Spotify returned ${response.status}: ${error}`);
    }
    return response.json();
}

export async function getUserPlaylists(accessToken: string): Promise<Playlists> {
    if (!accessToken) throw new Error("No access token");

    const response: Response = await fetch(`https://api.spotify.com/v1/me/playlists`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const error: string = await response.text();
        throw new Error(`Spotify returned ${response.status}: ${error}`);
    }

    return response.json();
}

export async function getPlaylist(accessToken: string, playlistId: string): Promise<any> {
    if (!accessToken) throw new Error("No access token");

    const response: Response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    });

    if (!response.ok) {
        const error: string = await response.text();
        throw new Error(`Spotify returned ${response.status}: ${error}`);
    }

    return response.json();
}

export async function createPlaylist(
    accessToken: string,
    name: string,
    description: string,
    isPublic: boolean
) {
    const response = await fetch(`https://api.spotify.com/v1/me/playlists`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            description,
            public: isPublic,
        }),
    });

    if (!response.ok) {
        const error: string = await response.text();
        throw new Error(`Spotify returned ${response.status}: ${error}`);
    }

    return response.json();
}

/**
 * Spotify rate limits adding tracks to playlists to 100 tracks per request.
 */
async function _addTracksToPlaylist100(
    accessToken: string,
    playlistId: string,
    uris: string[]
) {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/items`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            uris,
        }),
    });

    if (!response.ok) {
        const error: string = await response.text();
        throw new Error(`Spotify returned ${response.status}: ${error}`);
    }

    return response.json();
}

/**
 * Spotify rate limits adding tracks to playlists to 100 tracks per request.
 * This works around rate limits by chunking.
 */
export async function addTracksToPlaylist(
    accessToken: string,
    playlistId: string,
    uris: string[]
) {
    for (let i = 0; i < uris.length; i += 100) {
        const chunk: string[] = uris.slice(i, i + 100);
        await _addTracksToPlaylist100(accessToken, playlistId, chunk);
    }
}

export async function getPlaylistImages(
    accessToken: string,
    playlistId: string
) {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/images`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const error: string = await response.text();
        throw new Error(`Spotify returned ${response.status}: ${error}`);
    }

    return response.json();
}

export async function setPlaylistImage(
    accessToken: string,
    playlistId: string,
    base64Jpeg: string
) {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/images`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "image/jpeg",
        },
        body: base64Jpeg,
    });

    if (!response.ok) {
        const error: string = await response.text();
        throw new Error(`Spotify returned ${response.status}: ${error}`);
    }
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

export async function addToQueue(accessToken: string, uri: string): Promise<void> {
    const response = await fetch(
        `https://api.spotify.com/v1/me/player/queue?uri=${encodeURIComponent(uri)}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
        const error: string = await response.text();
        throw new Error(`Spotify returned ${response.status}: ${error}`);
    }
}

export async function addTracksToQueue(accessToken: string, uris: string[]): Promise<void> {
    for (const uri of uris) {
        await addToQueue(accessToken, uri);
    }
}

export async function startPlayback(accessToken: string, uris: string[]) {
    if (!accessToken) throw new Error("No access token");

    const response: Response = await fetch(`https://api.spotify.com/v1/me/player/play`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({uris}),
    });

    if (!response.ok) {
        const error: string = await response.text();
        throw new Error(`Spotify returned ${response.status}: ${error}`);
    }
}