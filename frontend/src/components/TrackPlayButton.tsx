import React from "react";
import "../styles/playlist-button.css";

type TrackPlayButtonProps = {
    isPlaying: boolean;
} & React.ComponentProps<'button'>;

export function TrackPlayButton({
                                    isPlaying,
                                    ...buttonProps
                                }: TrackPlayButtonProps) {
    return (
        <button
            className="playlist-button playlist-button--track-play"
            aria-label={isPlaying ? 'Pause track' : 'Play track'}
            {...buttonProps}
        >
            <svg
                viewBox="0 0 24 24"
                className="playlist-button__track-play-icon"
                aria-hidden="true"
            >
                {isPlaying ? (
                    <>
                        <path d="M6 5h4v14H6z" />
                        <path d="M14 5h4v14h-4z" />
                    </>
                ) : (
                    <path d="M8 5v14l11-7z" />
                )}
            </svg>
        </button>
    );
}