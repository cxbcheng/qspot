import React, {JSX} from "react";
import "../styles/playlist-button.css";

type PlayButtonProps = {
    isPlaying: boolean;
} & React.ComponentProps<'button'>;


export function PlayButton({
                               isPlaying,
                               ...buttonProps
                           }: PlayButtonProps): JSX.Element {
    return (
        <button
            className="playlist-button playlist-button--play"
            aria-label={isPlaying ? 'Pause playlist' : 'Play playlist'}
            {...buttonProps}
        >
            <svg
                viewBox="0 0 24 24"
                className="playlist-button__play-icon"
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