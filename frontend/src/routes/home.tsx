import {redirect} from "react-router";
import {useLoaderData} from "react-router-dom";
import {UserProfile} from "../../../shared/types/UserProfile";
import {Navbar} from "../components/Navbar.tsx";
import {PlaylistGrid} from "../components/PlaylistGrid.tsx";

interface ResponseObject {
    profile: UserProfile;
    playlists: any;
}

export async function loader() {
    const resProfile: Response = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/api/me`, {
            credentials: "include",
        }
    );

    if (resProfile.status === 401) {
        return redirect('/login');
    }

    const resPlaylists: Response = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/api/me/playlists`, {
            credentials: "include",
        }
    );

    return {
        profile: await resProfile.json(),
        playlists: await resPlaylists.json(),
    };
}

export function Component() {
    const res: ResponseObject = useLoaderData<ResponseObject>();

    return (
        <>
            <Navbar profile={res.profile}/>
            <main>
                <PlaylistGrid playlists={res.playlists.items} />
            </main>
        </>
    );
}