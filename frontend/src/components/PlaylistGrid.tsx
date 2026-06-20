import {Playlist} from "../../../shared/types/Playlist.ts";
import "../styles/playlist-grid.css";
import {Link} from "react-router-dom";
import {JSX} from "react";

interface PlaylistGridProps {
    playlists: Playlist[];
}

export function PlaylistGrid({playlists}: PlaylistGridProps): JSX.Element {
    // Filter out empty playlists
    const filteredPlaylists = playlists.filter((playlist: Playlist) => !!playlist.items?.total);

    return (
        <div className="playlist-grid">
            {filteredPlaylists.map((playlist) => (
                <Link
                    key={playlist.id}
                    to={`/playlists/${playlist.id}`}
                    className="playlist-card"
                >
                    <img
                        src={
                            playlist.images?.[0]?.url || "/img/spotify-playlist-blank-cover.png"
                        }
                        alt={playlist.name}
                        className="playlist-card__image"
                    />
                    <p>{playlist.name}</p>
                    <p className="playlist-card__owner">{playlist.owner.display_name}</p>
                </Link>
            ))}
        </div>
    );
}