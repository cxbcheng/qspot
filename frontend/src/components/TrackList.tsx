import {PlaylistItem} from "../../../shared/types/Playlist.ts";
import "../styles/track-list.css";
import React, {JSX} from "react";
import {TrackPlayButton} from "./TrackPlayButton.tsx";

interface TrackListProps {
    tracks: PlaylistItem[];
    handlePlayFromPosition: (index: number, e: React.MouseEvent<any>) => void;
}

export function TrackList({ tracks, handlePlayFromPosition }: TrackListProps): JSX.Element {
    return (
        <section className="track-list">
            <div className="track-list__header">
                <span>#</span>
                <span>Title</span>
                <span>Artist</span>
            </div>

            {tracks.map(
                (playlistItem: PlaylistItem, index: number) => {
                    const track = playlistItem.item;

                    const handleRowClick = (e: React.MouseEvent<HTMLDivElement>) => {
                        if (window.matchMedia('(max-width: 768px)').matches) {
                            handlePlayFromPosition(index, e);
                        }
                    };

                    return (
                        <div
                            key={track.id}
                            className="track-row"
                            onClick={handleRowClick}
                        >
                                <span className="track-number-cell">
                                    <span className="track-index">{index + 1}</span>
                                    <TrackPlayButton
                                        isPlaying={false}
                                        onClick={(e) => handlePlayFromPosition(index, e)}
                                    />
                                </span>

                            <div className="track-title">
                                {track.album.images?.[0] && (
                                    <img
                                        src={track.album.images[0].url}
                                        alt={track.album.name}
                                        className="track-cover"
                                    />
                                )}

                                <div>
                                    <div className="track-name">
                                        {track.name}
                                    </div>
                                </div>
                            </div>

                            <div className="track-artists">
                                {track.artists
                                    .map(
                                        (
                                            artist
                                        ) =>
                                            artist.name
                                    )
                                    .join(", ")}
                            </div>
                        </div>
                    );
                }
            )}
        </section>
    );
}