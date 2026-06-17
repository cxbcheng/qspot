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
        return redirect('/login');
    }

    return response.json();
}

export function Component() {
    const profile: UserProfile = useLoaderData<UserProfile>();
    console.log(profile);

    return (
        <div>
            <h1>Welcome, {profile.display_name}</h1>
        </div>
    );
}