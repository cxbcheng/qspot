import {isRouteErrorResponse, Outlet, useRouteError} from "react-router-dom";
import {RateLimitErrorView} from "./components/RateLimitErrorView.tsx";

export function ErrorBoundary() {
    const error = useRouteError();
    console.error(error);

    // Catch 429 thrown from the loader
    if (isRouteErrorResponse(error)) {
        if (error.status === 429) {
            let retrySecs = error.data?.retrySecs ?? 15;

            return <RateLimitErrorView retryAfterSeconds={retrySecs}/>;
        } else {
            return (
                <div className="centered">
                    <h2>{error.status}</h2>
                    <p>{error.statusText}</p>
                </div>
            );
        }
    }

    // Fallback for other errors or unexpected crashes
    return (
        <div className="centered">
            <h2>Oops, something went wrong.</h2>
            <p>An unexpected error occurred.</p>
        </div>
    );
}

export default function Root() {
    return <Outlet />;
}