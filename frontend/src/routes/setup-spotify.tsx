import "../styles/setup-spotify.css";

const SPOTIFY_DASHBOARD = "https://developer.spotify.com/dashboard";
const GITHUB_URL = "https://github.com/cxbcheng/classically";
const SPOTIFY_API_RESTRICTIONS = "https://developer.spotify.com/documentation/web-api/concepts/quota-modes";

export function Component() {
    return (
        <main className="setup-spotify">
            <div className="setup-spotify__container">
                <header className="setup-spotify__intro">
                    <p className="setup-spotify__eyebrow">Spotify access</p>
                    <h1>Let&rsquo;s get you connected</h1>

                    <p className="setup-spotify__lede">
                        You signed in with Spotify, but your library&rsquo;s
                        still locked. Here&rsquo;s why, and how to fix it.
                    </p>

                    <p>
                        This usually happens because the Spotify app is still
                        in <strong>Development Mode,</strong> and your
                        account hasn&rsquo;t been added to its allowlist yet.
                    </p>
                </header>

                <div className="setup-spotify__content">
                    <section className="setup-spotify__panel">
                        <h2>Running your own copy?</h2>

                        <ol className="setup-spotify__steps">
                            <li>Open the Spotify Developer Dashboard.</li>
                            <li>Pick your Spotify application.</li>
                            <li>Head to User Management.</li>
                            <li>Add your Spotify account email to the allowlist.</li>
                            <li>Come back and sign in again.</li>
                        </ol>

                        <div className="setup-spotify__actions">
                            <a
                                className="button button--primary"
                                href={SPOTIFY_DASHBOARD}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Open Spotify Dashboard
                            </a>

                            <a className="button button--secondary" href="/login">
                                Try again
                            </a>
                        </div>
                    </section>

                    <section className="setup-spotify__panel setup-spotify__panel--muted">
                        <h2>Using the public demo?</h2>

                        <p>
                            Due to Spotify's recent <a className="hyperlink" href={SPOTIFY_API_RESTRICTIONS} target="_blank" rel="noopener noreferrer">API restrictions</a>, Spotify caps
                            development-mode apps to an approved allowlist.
                        </p>

                        <p>
                            Check the GitHub repo for details on Spotify&rsquo;s
                            current API limits, and how to run Classically yourself
                            with your own developer app.
                        </p>

                        <a
                            className="setup-spotify__github"
                            href={GITHUB_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View Classically on GitHub <span aria-hidden="true">→</span>
                        </a>
                    </section>
                </div>
            </div>
        </main>
    );
}