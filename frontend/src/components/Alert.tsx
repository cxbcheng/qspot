import {useEffect, useState, RefObject, useRef} from "react";
import "../styles/alert.css";

/**
 * Alert
 *
 * A multimode alert component. If a `targetRef` is provided, it renders
 * directly below that element like a contextual chat bubble.
 * Otherwise, it falls back to a floating banner at the bottom of the viewport.
 */
export interface AlertProps {
    message: string;
    onDismiss: () => void;
    /** Optional React Ref of the element this alert should point to. */
    targetRef?: RefObject<HTMLElement | null>;
    duration?: number;
}

export function Alert({ message, onDismiss, targetRef, duration }: AlertProps) {
    const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
    const [isLeaving, setIsLeaving] = useState(false); // Track exit animation state
    const isAnchored = !!targetRef?.current;
    const alertRef = useRef<HTMLDivElement>(null);

    // Trigger exit animation before unmounting
    const triggerDismiss = useRef(() => {});
    triggerDismiss.current = () => {
        setIsLeaving(true);
        setTimeout(onDismiss, 200); // Account for 0.2s exit animation duration
    };

    // Autofocus the alert when it appears
    useEffect(() => {
        alertRef.current?.focus();
    }, []);

    // Auto-dismiss
    useEffect(() => {
        if (!duration || duration <= 0) return;
        const timer = setTimeout(triggerDismiss.current, duration);
        return () => clearTimeout(timer);
    }, [duration, message, onDismiss]);

    useEffect(() => {
        if (!targetRef?.current) {
            setCoords(null);
            return;
        }

        const updatePosition = () => {
            if (!targetRef.current) return;

            const rect = targetRef.current.getBoundingClientRect();

            // Calculate absolute page positions (including page scroll)
            setCoords({
                top: rect.bottom + window.scrollY + 10, // 10px spacing below the element
                left: rect.left + window.scrollX,
            });
        };

        // Run initially
        updatePosition();

        // Keep position accurate during window resizing
        window.addEventListener("resize", updatePosition);
        return () => window.removeEventListener("resize", updatePosition);
    }, [targetRef]);

    // Apply absolute inline coordinates only if an anchor element is active
    const placementStyles = isAnchored && coords
        ? { top: `${coords.top}px`, left: `${coords.left}px` }
        : {};

    // Dynamic classes based on state and placement mode
    const baseClass = isAnchored ? "alert--anchored" : "alert--fallback";
    const animationClass = isLeaving ? "alert--leaving" : "";

    return (
        <div
            className={`alert ${baseClass} ${animationClass}`}
            style={placementStyles}
            role="alert"
            ref={alertRef}
            tabIndex={-1}
        >
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