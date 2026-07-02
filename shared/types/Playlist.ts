import {Artist} from "./Artist.ts";

export interface Playlists {
    next: string | null;
    items: Playlist[];
    limit: number;
}

export interface Playlist {
    external_urls: {
        spotify: string;
    };
    href: string;
    id: string;
    name: string;
    description: string;
    images: {
        url: string;
    }[];
    owner: {
        display_name: string;
    };
    items?: {
        items?: PlaylistItem[];
        total?: number;
    };
}

export interface PlaylistItem {
    added_at: string;
    added_by: string;
    is_local: boolean;
    item: {
        album: {
            album_type: string;
            artists: Artist[];
            name: string;
            id: string;
            release_date: string;
            total_tracks: number;
            type: string;
            images: {
                url: string;
            }[];
        };
        artists: Artist[];
        id: string;
        name: string;
        track: boolean;
        uri: string;
        track_number: number;
    }
}