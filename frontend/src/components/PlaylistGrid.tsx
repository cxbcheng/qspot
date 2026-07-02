import { Playlist } from "../../../shared/types/Playlist.ts";
import { Link } from "react-router-dom";
import {JSX, useEffect, useRef} from "react";
import { GridShuffleButton } from "./GridShuffleButton.tsx";
import "../styles/playlist-grid.css";

interface PlaylistGridProps {
    playlists: Playlist[];
    hasMore: boolean;
    isLoading: boolean;
    onLoadMore: () => void;
}

export function PlaylistGrid({ playlists, hasMore, isLoading, onLoadMore }: PlaylistGridProps): JSX.Element {
    // Filter out playlists with zero tracks
    const filteredPlaylists = playlists.filter((playlist: Playlist) => !!playlist.items?.total);

    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!hasMore) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !isLoading) onLoadMore();
        }, { rootMargin: "300px" });

        const sentinel = sentinelRef.current;
        if (sentinel) {
            observer.observe(sentinel);
        }

        return () => observer.disconnect();
    }, [hasMore, isLoading, onLoadMore]);

    return (
        <>
            <div className="playlist-grid">
                {filteredPlaylists.map((playlist) => (
                    <Link
                        key={playlist.id}
                        to={`/playlists/${playlist.id}`}
                        className="playlist-card"
                    >
                        <div className="playlist-card__image-container">
                            <img
                                src={playlist.images?.[0]?.url || "/img/spotify-playlist-blank-cover.png"}
                                alt={playlist.name}
                                className="playlist-card__image"
                            />
                            <div className="playlist-card__overlay">
                                <GridShuffleButton
                                    playlistId={playlist.id}
                                    playlistName={playlist.name}
                                />
                            </div>
                        </div>
                        <p>{playlist.name}</p>
                        <p className="playlist-card__owner">{playlist.owner.display_name}</p>
                    </Link>
                ))}
            </div>
            {hasMore && <div ref={sentinelRef} style={{height: 1}}/>}
            {isLoading && <p>Loading more playlists&hellip;</p>}
        </>
    );
}