import {UserProfile} from "../../shared/types/UserProfile";

export async function getProfile(accessToken: string): Promise<UserProfile> {
    if (!accessToken) throw new Error("No access token");

    const response: Response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) throw new Error(`Spotify returned ${response.status}`);
    return response.json();
}