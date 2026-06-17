/**
 * Alert
 *
 * A dismissible, visually distinct inline alert used to surface
 * human-friendly error messages (e.g. failed Spotify login attempts).
 *
 * The component is intentionally presentation-only: the parent decides
 * *whether* to render it (typically derived from a URL search param), and
 * is responsible for clearing that state when `onDismiss` fires.
 */

export interface AlertProps {
    /** Human-friendly message to display to the user. */
    message: string;
    /** Called when the user dismisses the alert (e.g. clears it from the URL). */
    onDismiss: () => void;
}

export function Alert({ message, onDismiss }: AlertProps) {
    return (
        <div className="alert" role="alert">
            <svg
                className="alert__icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
            >
                <path
                    fill="currentColor"
                    d="M12 2 1 21h22L12 2Zm0 5.99L18.92 19H5.08L12 7.99ZM11 10v5h2v-5h-2Zm0 6.5v2h2v-2h-2Z"
                />
            </svg>

            <p className="alert__message">{message}</p>

            <button
                type="button"
                className="alert__dismiss"
                onClick={onDismiss}
                aria-label="Dismiss error message"
            >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path
                        fill="currentColor"
                        d="M18.3 5.71 12 12.01l-6.3-6.3-1.4 1.41 6.29 6.3-6.3 6.29 1.41 1.41 6.3-6.29 6.29 6.29 1.41-1.41-6.29-6.29 6.29-6.3z"
                    />
                </svg>
            </button>
        </div>
    );
}