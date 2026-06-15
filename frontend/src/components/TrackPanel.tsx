export default function TrackPanel() {
    return (
        <section className="panel track-panel">
            <h2>Now Playing</h2>

            <div className="track-info">
                <h3>Canon in D</h3>
                <p>Johann Pachelbel</p>
            </div>

            <div className="tabs">
                <button>Lyrics</button>
                <button>Score</button>
                <button>Tabs</button>
            </div>

            <div className="content-view">
                <div className="placeholder">
                    Sheet music, lyrics, or guitar tabs will appear here.
                </div>
            </div>
        </section>
    );
}