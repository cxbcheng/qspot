import {UserProfile} from "../../shared/types/UserProfile";

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

export async function getUserPlaylists(accessToken: string): Promise<any> {
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