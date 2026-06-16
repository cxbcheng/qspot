import { redirect } from "react-router";

export async function loader() {
    const response: Response = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/api/me`,
        {
            credentials: "include",
        }
    );

    if (response.status === 401) {
        return redirect(
            `${import.meta.env.VITE_BACKEND_URI}/login`
        );
    }

    return response.json();
}

export default function Home() {
    console.log("Home page");
    return (
        <div>Home page</div>
    );
}