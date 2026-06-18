export interface Playlists {
    items: Playlist[];
    limit: number;
}

export interface Playlist {
    id: string;
    name: string;
    images: {
        url: string;
    }[];
    owner: {
        display_name: string;
    };
    items?: {
        total?: number;
    };
}