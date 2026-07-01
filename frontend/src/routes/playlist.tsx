import {useLoaderData, useNavigate} from "react-router-dom";
import {redirect} from "react-router";
import {UserProfile} from "../../../shared/types/UserProfile.ts";
import {Playlist, PlaylistItem} from "../../../shared/types/Playlist.ts";
import "../styles/playlist.css";
import {TrackList} from "../components/TrackList.tsx";
import {classicalShuffle} from "../../../shared/utils/shuffle.ts";
import {useState} from "react";
import {PlayButton} from "../components/PlayButton.tsx";
import {createShuffledPlaylist, fetchPlaylist, fetchProfile, startPlayback} from "../api/fetch.ts";
import {Navbar} from "../components/Navbar.tsx";

interface ResponseObject {
    profile: UserProfile;
    playlist: Playlist;
}

export async function loader({params, request}: { params: { playlistId?: string }; request: Request; }) {
    const playlistId = params.playlistId;
    if (!playlistId) throw new Error('Missing playlist ID');

    const resProfile: Response = await fetchProfile();

    if (resProfile.status === 401) {
        const url = new URL(request.url);
        const callback = url.pathname + url.search + url.hash;
        const safeCallback =
            callback &&
            callback.startsWith("/") &&
            !callback.startsWith("//")
                ? callback
                : "/";
        throw redirect(`/login?callback=${encodeURIComponent(safeCallback)}`);
    }

    const resPlaylist: Response = await fetchPlaylist(playlistId);

    // Redirect to main page if playlist does not exist
    if (!resPlaylist.ok) return redirect('/');

    return {
        profile: await resProfile.json(),
        playlist: await resPlaylist.json(),
    };
}

export function Component() {
    const res: ResponseObject = useLoaderData<ResponseObject>();
    const playlist: Playlist = res.playlist;
    const initialTracks: PlaylistItem[] = playlist.items?.items ?? [];
    const [tracks, setTracks] = useState<PlaylistItem[]>(initialTracks);
    const navigate = useNavigate();

    function handleShuffle() {
        setTracks(classicalShuffle(tracks));
    }

    async function handleCreateShuffledPlaylist() {
        const uris: string[] = tracks.map(track => track.item.uri);
        const response = await createShuffledPlaylist(playlist.id, uris);
        const shuffledPlaylist = await response.json();
        return navigate(`/playlists/${shuffledPlaylist.playlistId}`);
    }

    function revertShuffle() {
        setTracks(initialTracks);
    }

    async function playShuffled(fromIndex: number = 0) {
        const uris: string[] = tracks.map(track => track.item.uri).splice(fromIndex);
        const response = await startPlayback(uris);
        if (!response.ok) throw new Error("Failed to play shuffled playlist");
    }

    async function handlePlayShuffled() {
        await playShuffled();
    }

    async function handlePlayShuffledFrom(index: number) {
        await playShuffled(index);
    }

    return (
        <><Navbar profile={res.profile} />
            <main className="playlist-page">
                <header className="playlist-header">
                    <img
                        src={playlist.images?.[0]?.url || "/img/spotify-playlist-blank-cover.png"}
                        alt={playlist.name}
                        className="playlist-cover"/>

                    <div className="playlist-meta">
                        <p className="playlist-type">
                            Playlist
                        </p>

                        <h1 className="playlist-name">
                            {playlist.name}
                        </h1>

                        {playlist.description && (
                            <p className="playlist-description">
                                {playlist.description}
                            </p>
                        )}

                        <p className="playlist-owner">
                            {playlist.owner.display_name}
                        </p>

                        <p className="playlist-count">
                            {playlist.items?.total ?? 0}
                            {" "}tracks
                        </p>
                    </div>
                </header>

                <section className="playlist-actions">
                    <button
                        className="playlist-button playlist-button--shuffle"
                        aria-label="Shuffle playlist"
                        onClick={handleShuffle}
                    >
                        <img
                            src="/img/shuffle.png"
                            alt="Shuffle playlist"
                            className="playlist-button__icon"/>
                    </button>
                    <PlayButton isPlaying={false} onClick={handlePlayShuffled}/>
                    <button
                        className="playlist-button playlist-button--secondary"
                        onClick={revertShuffle}
                    >
                        Revert
                    </button>

                    <button
                        className="playlist-button playlist-button--primary"
                        onClick={handleCreateShuffledPlaylist}
                    >
                        Create Playlist
                    </button>
                </section>

                <TrackList tracks={tracks} handlePlayFromPosition={handlePlayShuffledFrom}/>
            </main>
        </>
    );
}