const playlist = {
    name: "Classical Favorites",
    tracks: [
        {
            title: "Symphony No. 5",
            composer: "Beethoven",
            movement: "I. Allegro con brio",
        },
        {
            title: "Symphony No. 5",
            composer: "Beethoven",
            movement: "II. Andante con moto",
        },
        {
            title: "Requiem",
            composer: "Mozart",
            movement: "Introitus",
        },
    ],
};

export default function PlaylistView() {
    return (
        <section className="panel playlist-panel">
            <div className="panel-header">
                <h2>{playlist.name}</h2>
                <button>Shuffle by Piece</button>
            </div>

            <ul className="track-list">
                {playlist.tracks.map((track, index) => (
                    <li key={index} className="track">
                        <strong>{track.title}</strong>
                        <div>{track.movement}</div>
                        <small>{track.composer}</small>
                    </li>
                ))}
            </ul>
        </section>
    );
}