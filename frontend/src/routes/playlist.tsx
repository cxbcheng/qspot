import {Link, useLoaderData, useLocation, useNavigate} from "react-router-dom";
import {redirect} from "react-router";
import {UserProfile} from "../../../shared/types/UserProfile.ts";
import {Playlist, PlaylistItem} from "../../../shared/types/Playlist.ts";
import "../styles/playlist.css";
import {TrackList} from "../components/TrackList.tsx";
import {classicalShuffle} from "../../../shared/utils/shuffle.ts";
import {useEffect, useRef, useState} from "react";
import {PlayButton} from "../components/PlayButton.tsx";
import {createShuffledPlaylist, fetchPlaylist, fetchProfile, attemptPlayback} from "../api/fetch.ts";
import {Navbar} from "../components/Navbar.tsx";
import {Alert} from "../components/Alert.tsx";
import {useAsyncLock} from "../hooks/useAsyncLock.ts";

interface ResponseObject {
    profile: UserProfile;
    playlist: Playlist;
}

export async function loader({params, request}: { params: { playlistId?: string }; request: Request; }) {
    const playlistId = params.playlistId;
    if (!playlistId) throw new Error('Missing playlist ID');

    const [resProfile, resPlaylist] = await Promise.all([
        fetchProfile({
            statusHandlers: {
                401: () => {
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
            }
        }),
        fetchPlaylist(playlistId)
    ]);

    // Redirect to main page if playlist does not exist
    if (!resPlaylist.ok) return redirect('/');

    return {
        profile: await resProfile.json(),
        playlist: await resPlaylist.json(),
    };
}

export function Component() {
    const navigate = useNavigate();
    const location = useLocation();

    const res: ResponseObject = useLoaderData<ResponseObject>();
    const playlist: Playlist = res.playlist;
    const initialTracks: PlaylistItem[] = playlist.items?.items ?? [];

    const playButtonRef = useRef<HTMLButtonElement>(null);
    const quickShuffle = !!location.state?.quickShuffle;

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // If quick shuffle is on, shuffle the tracks once from the original order
    const [tracks, setTracks] = useState<PlaylistItem[]>(() => {
        return quickShuffle ? classicalShuffle(initialTracks) : initialTracks;
    });

    const asyncLock = useAsyncLock();

    useEffect(() => {
        if (quickShuffle) {
            playButtonRef.current?.focus();
        }

        // Reset location state: no quick shuffling on re-renders
        window.history.replaceState({}, "");
    }, [quickShuffle]);

    function handleShuffle() {
        setTracks(classicalShuffle(tracks));
    }

    async function callCreateShuffledPlaylist() {
        const uris: string[] = tracks.map(track => track.item.uri);
        const response = await createShuffledPlaylist(playlist.id, uris);
        const shuffledPlaylist = await response.json();
        return navigate(`/playlists/${shuffledPlaylist.playlistId}`);
    }

    async function handleCreatePlaylist() {
        await asyncLock.run(() => callCreateShuffledPlaylist());
    }

    function revertShuffle() {
        setTracks(initialTracks);
    }

    async function playShuffled(fromIndex: number = 0) {
        const uris: string[] = tracks.map(track => track.item.uri).splice(fromIndex);

        await attemptPlayback(uris, {
            statusHandlers: {
                404: () => {
                    setErrorMessage("No active Spotify device found. Open Spotify on one of your devices and start playback there first.");
                },
                429: (res: Response) => {
                    setErrorMessage(`${res.status}: ${res.statusText}`);
                }
            }
        });
    }

    async function handlePlayShuffled() {
        await asyncLock.run(() => playShuffled());
    }

    async function handlePlayShuffledFrom(index: number) {
        await asyncLock.run(() => playShuffled(index));
    }

    return (
        <><Navbar profile={res.profile} />
            <main className="playlist-page">
                {errorMessage && (
                    <Alert
                        message={errorMessage}
                        onDismiss={() => setErrorMessage(null)}
                        targetRef={playButtonRef}
                        duration={5000}
                    />
                )}

                <header className="playlist-header">
                    <img
                        src={playlist.images?.[0]?.url || "/img/spotify-playlist-blank-cover.png"}
                        alt={playlist.name}
                        className="playlist-cover"/>

                    <div className="playlist-meta">
                        <p className="playlist-type">
                            Playlist
                        </p>

                        <Link to={playlist.external_urls.spotify ?? ""} className="playlist-name" target="_blank">
                            {playlist.name}
                        </Link>

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
                    <PlayButton isPlaying={false} onClick={handlePlayShuffled} ref={playButtonRef}/>
                    <button
                        className="playlist-button playlist-button--secondary"
                        onClick={revertShuffle}
                    >
                        Revert
                    </button>

                    <button
                        className="playlist-button playlist-button--primary"
                        onClick={handleCreatePlaylist}
                    >
                        Create Playlist
                    </button>
                </section>

                <TrackList tracks={tracks} handlePlayFromPosition={handlePlayShuffledFrom}/>
            </main>
        </>
    );
}