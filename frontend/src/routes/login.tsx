import { useSearchParams } from "react-router-dom";
import { Alert } from "../components/Alert";
import { SpotifyButton } from "../components/SpotifyButton";
import "../styles/login.css";

/**
 * Maps backend-provided `?error=` codes to human-friendly copy.
 * Add new codes here as the OAuth callback grows new failure modes.
 */
const ERROR_MESSAGES: Record<string, string> = {
    state_mismatch: "We couldn't verify your Spotify login. Please try again.",
    missing_code:
        "Spotify didn't send the information we needed. Please try again.",
    invalid_token:
        "Your session is invalid or has expired. Please sign in again.",
    server_error:
        "Something went wrong on our end. Please try again in a moment.",
};

const DEFAULT_ERROR_MESSAGE = "Something unexpected happened. Please try again.";

function getErrorMessage(code: string | null): string | null {
    if (!code) return null;
    return ERROR_MESSAGES[code] ?? DEFAULT_ERROR_MESSAGE;
}

export function Component() {
    const [searchParams, setSearchParams] = useSearchParams();
    const errorCode = searchParams.get("error");
    const errorMessage = getErrorMessage(errorCode);

    const spotifyLoginUrl = `${import.meta.env.VITE_BACKEND_URI}/login`;

    // Dismissing the alert removes `error` from the URL — the alert's
    // visibility is fully derived from search params, so there's no separate
    // "dismissed" state to keep in sync.
    function handleDismissAlert() {
        const next = new URLSearchParams(searchParams);
        next.delete("error");
        setSearchParams(next, { replace: true });
    }

    return (
        <main className="login-page">
            <div className="login-page__ambient" aria-hidden="true" />

            <div className="login-card">
                {errorMessage && (
                    <Alert message={errorMessage} onDismiss={handleDismissAlert} />
                )}

                <h1 className="login-card__title">QSpot</h1>

                <p className="login-card__subtitle">
                    Spotify playlist enhancements for classical music.
                </p>

                <div className="login-card__action">
                    <p className="login-card__action-label" id="spotify-cta-label">
                        Connect Spotify to access grouped shuffle features.
                    </p>
                    <SpotifyButton
                        href={spotifyLoginUrl}
                        className="login-card__cta"
                        aria-describedby="spotify-cta-label"
                    />
                </div>

                <p className="login-card__footer">Uses the Spotify Web API</p>
            </div>
        </main>
    );
}