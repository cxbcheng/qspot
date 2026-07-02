import {useLoaderData} from "react-router-dom";
import {UserProfile} from "../../../shared/types/UserProfile";
import {Navbar} from "../components/Navbar.tsx";
import {PlaylistGrid} from "../components/PlaylistGrid.tsx";
import {Playlists} from "../../../shared/types/Playlist.ts";
import {fetchPlaylists, fetchProfile} from "../api/fetch.ts";
import {useCallback, useRef, useState} from "react";

interface ResponseObject {
    profile: UserProfile;
    playlists: Playlists;
}

export async function loader() {
    const [resProfile, resPlaylists] = await Promise.all([
        fetchProfile(),
        fetchPlaylists()
    ]);

    const profile = await resProfile.json();
    const playlists = await resPlaylists.json();
    return {profile, playlists};
}

export function Component() {
    const res: ResponseObject = useLoaderData<ResponseObject>();
    const initial = res.playlists;
    const [playlists, setPlaylists] = useState(initial.items);
    const [offset, setOffset] = useState(50);
    const [hasMore, setHasMore] = useState(initial.next !== null);
    const [loading, setLoading] = useState(false);

    const isFetching = useRef(false);

    const loadMore = useCallback(async () => {
        if (loading || !hasMore || isFetching.current) return;

        // Synchronous locks
        isFetching.current = true;
        setLoading(true);

        try {
            const res = await fetchPlaylists(offset);
            const page = await res.json();

            setPlaylists(prev => {
                const combined = [...prev, ...page.items];
                // Deduplication
                return combined.filter((item, index, self) =>
                    index === self.findIndex((t) => t.id === item.id)
                );
            });
            setOffset(prev => prev + page.items.length);
            setHasMore(page.next !== null);
        } catch (e) {
            console.error("Failed to fetch more playlists:", e);
        } finally {
            isFetching.current = false;
            setLoading(false);
        }
    }, [loading, hasMore, playlists.length]);

    return (
        <>
            <Navbar profile={res.profile}/>
            <main>
                <PlaylistGrid playlists={playlists} hasMore={hasMore} isLoading={loading} onLoadMore={loadMore} />
            </main>
        </>
    );
}