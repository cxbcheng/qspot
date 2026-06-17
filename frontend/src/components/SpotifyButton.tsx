import {
    useState,
    type AnchorHTMLAttributes,
    type MouseEvent,
    type ReactNode,
} from "react";

/**
 * SpotifyButton
 *
 * A full-redirect link styled as Spotify's own brand guidelines expect
 * (green field, black wordmark/icon) — intentionally kept visually separate
 * from QSpot's coffee-brown identity so the button stays recognizable as
 * "the Spotify one" on a page that otherwise looks nothing like Spotify.
 *
 * Renders as a real <a> (not a client-side route) since Spotify OAuth
 * requires a full navigation to the backend's `/login` endpoint. A brief
 * "connecting" state gives immediate feedback after the click (Doherty
 * Threshold) for the moment before the browser actually navigates away.
 */
export interface SpotifyButtonProps
    extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
    /** Destination URL, e.g. `${VITE_BACKEND_URI}/login`. */
    href: string;
    children?: ReactNode;
}

export function SpotifyButton({
                                  href,
                                  children = "Continue with Spotify",
                                  className,
                                  onClick,
                                  ...rest
                              }: SpotifyButtonProps) {
    const [isConnecting, setIsConnecting] = useState(false);

    function handleClick(event: MouseEvent<HTMLAnchorElement>) {
        // Ignore repeat activations (mouse or keyboard) once we're already
        // navigating — there's nothing more useful a second click can do.
        if (isConnecting) {
            event.preventDefault();
            return;
        }
        setIsConnecting(true);
        onClick?.(event);
    }

    const classes = [
        "spotify-button",
        isConnecting && "spotify-button--connecting",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <a
            className={classes}
            href={href}
            aria-busy={isConnecting}
            onClick={handleClick}
            {...rest}
        >
            {isConnecting ? <Spinner /> : <SpotifyIcon />}
            <span aria-live="polite">
        {isConnecting ? "Connecting to Spotify…" : children}
      </span>
        </a>
    );
}

/**
 * Hand-drawn Spotify-style mark (circle + soundwave arcs). Colors are kept
 * literal rather than `currentColor` so the cutout illusion holds even when
 * the button's `filter: brightness()` hover effect is applied. Keep the
 * green value here in sync with `--spotify-green` in login.css.
 */
function SpotifyIcon() {
    return (
        <svg
            className="spotify-button__icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
        >
            <circle cx="12" cy="12" r="11" fill="#000000" />
            <path
                d="M6.6 15.6c3.6-1 7.7-.8 10.8 1"
                fill="none"
                stroke="#1ED760"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M6.1 12.3c4.2-1.3 9-1 12.6 1.1"
                fill="none"
                stroke="#1ED760"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M5.6 9c4.8-1.4 10.3-1 14.3 1.4"
                fill="none"
                stroke="#1ED760"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}

function Spinner() {
    return (
        <svg
            className="spotify-button__spinner"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
        >
            <circle
                cx="12"
                cy="12"
                r="9"
                fill="none"
                stroke="#0a0a0a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="34 22"
            />
        </svg>
    );
}