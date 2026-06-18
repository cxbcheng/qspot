import {Playlist} from "../../../shared/types/Playlist.ts";
import "../styles/playlist-grid.css";

interface PlaylistGridProps {
    playlists: Playlist[];
}

export function PlaylistGrid({playlists}: PlaylistGridProps) {
    return (
        <div className="playlist-grid">
            {playlists.map((playlist) => (
                <div
                    key={playlist.id}
                    className="playlist-card"
                >
                    <img
                        src={
                            playlist.images?.[0]?.url || "/img/spotify-playlist-blank-cover.png"
                        }
                        alt={playlist.name}
                        className="playlist-card__image"
                    />

                    <h3>{playlist.name}</h3>

                    <p>
                        {playlist.owner.display_name}
                    </p>

                    {playlist.items?.total !== undefined && (
                        <p>
                            {playlist.items.total} tracks
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}