import {PlaylistItem} from "../../../shared/types/Playlist.ts";
import "../styles/track-list.css";
import {JSX} from "react";
import {TrackPlayButton} from "./TrackPlayButton.tsx";

interface TrackListProps {
    tracks: PlaylistItem[];
    handlePlayFromPosition: (index: number) => void;
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

                    return (
                        <div
                            key={track.id}
                            className="track-row"
                        >
                                <span className="track-number-cell">
                                    <span className="track-index">{index + 1}</span>
                                    <TrackPlayButton
                                        isPlaying={false}
                                        onClick={() => handlePlayFromPosition(index)}
                                    />
                                </span>

                            <div className="track-title">
                                {track.album
                                    .images?.[0] && (
                                    <img
                                        src={
                                            track
                                                .album
                                                .images[0]
                                                .url
                                        }
                                        alt={
                                            track.album
                                                .name
                                        }
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