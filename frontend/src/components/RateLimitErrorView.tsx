import {useState, useEffect, useRef} from "react";
import "../styles/rate-limit.css";

interface RateLimitErrorViewProps {
    retryAfterSeconds: number;
}

export function RateLimitErrorView({ retryAfterSeconds }: RateLimitErrorViewProps) {
    const [secondsLeft, setSecondsLeft] = useState(retryAfterSeconds);

    useEffect(() => {
        if (secondsLeft === 0) return;

        const timer = setTimeout(() => {
            setSecondsLeft((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [secondsLeft]);

    const handleRetry = () => {
        window.location.reload();
    };

    useEffect(() => {
        if (secondsLeft === 0) {
            handleRetry();
        }
    }, [secondsLeft]);

    return (
        <div className="centered">
            <div className="rate-limit__card surface">
                <p className="rate-limit__icon">{/* Insert coffee being poured animation here */}</p>
                <h2 tabIndex={-1}>Taking a short breather</h2>
                <p className="text-muted">
                    We've processed a lot of requests for your account recently.
                    Please give the system a moment to catch up.
                </p>

                <button
                    type="button"
                    className="rate-limit__button"
                    onClick={handleRetry}
                    disabled={secondsLeft > 0}
                >
                    {secondsLeft > 0
                        ? `Retry in ${secondsLeft} second${secondsLeft === 1 ? "" : "s"}`
                        : "Retrying..."}
                </button>
            </div>
        </div>
    );
}