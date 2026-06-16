import {redirect} from "react-router";
import {useLoaderData} from "react-router-dom";
import {UserProfile} from "../../../shared/types/UserProfile";

export async function loader() {
    const response: Response = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/api/me`, {
            credentials: "include",
        }
    );

    if (response.status === 401) {
        return redirect(`${import.meta.env.VITE_BACKEND_URI}/login`);
    }

    return response.json();
}

export function Component() {
    const profile: UserProfile = useLoaderData<UserProfile>();

    return (
        <div>
            <h1>Welcome, {profile.display_name}</h1>
        </div>
    );
}