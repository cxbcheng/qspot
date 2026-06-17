import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import session from 'express-session';
import 'dotenv/config';
import {getProfile, getUserPlaylists} from "./services/spotify";
import {UserProfile} from "../shared/types/UserProfile";

declare module 'express-session' {
    interface SessionData {
        state?: string;
        spotify?: {
            access_token: string;
            refresh_token: string;
        };
    }
}

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

const REDIRECT_URI = process.env.REDIRECT_URI;
const FRONTEND_URI = process.env.FRONTEND_URI;

const PORT = Number(process.env.PORT) || 8888;

if (!CLIENT_ID) {
    throw new Error('SPOTIFY_CLIENT_ID is missing');
}

if (!CLIENT_SECRET) {
    throw new Error('SPOTIFY_CLIENT_SECRET is missing');
}

if (!REDIRECT_URI) {
    throw new Error('REDIRECT_URI is missing');
}

if (!FRONTEND_URI) {
    throw new Error('FRONTEND_URI is missing');
}

const app = express();

// Allow frontend and backend connection
app.use(
    cors({
        origin: FRONTEND_URI,
        credentials: true
    })
);

app.use(
    session({
        secret:
            process.env.SESSION_SECRET ??
            'spotify-session-secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure:
                process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 300000
        }
    })
);

app.use(express.json());

function generateRandomString(length: number): string {
    return crypto.randomBytes(60).toString('hex').slice(0, length);
}

/**
 * GET /login
 * Redirect user to Spotify authorization page
 */
app.get('/login', (req, res) => {
    const state = generateRandomString(16);
    req.session.state = state;

    const scope = [
        'user-read-private',
        'user-read-email',
        'user-read-playback-state',
        'playlist-read-private',
        'playlist-modify-private',
        'playlist-modify-public',
    ].join(' ');

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope,
        redirect_uri: REDIRECT_URI,
        state
    });

    res.redirect(
        `https://accounts.spotify.com/authorize?${params.toString()}`
    );
});

/**
 * GET /callback
 * Spotify redirects here after login.
 * Server stores token data in express-session.
 */
app.get('/callback', async (req, res) => {
    const code =
        typeof req.query.code === 'string'
            ? req.query.code
            : null;

    const state =
        typeof req.query.state === 'string'
            ? req.query.state
            : null;

    const storedState = req.session.state ?? null;

    if (!state || state !== storedState) {
        return res.redirect(
            `${FRONTEND_URI}/login?${new URLSearchParams({
                error: 'state_mismatch'
            })}`
        );
    }

    if (!code) {
        return res.redirect(
            `${FRONTEND_URI}/login?${new URLSearchParams({
                error: 'missing_code'
            }).toString()}`
        );
    }

    delete req.session.state;

    try {
        const tokenResponse: Response = await fetch(
            'https://accounts.spotify.com/api/token',
            {
                method: 'POST',
                headers: {
                    'Content-Type':
                        'application/x-www-form-urlencoded',
                    Authorization:
                        'Basic ' +
                        Buffer.from(
                            `${CLIENT_ID}:${CLIENT_SECRET}`
                        ).toString('base64')
                },
                body: new URLSearchParams({
                    code,
                    redirect_uri: REDIRECT_URI,
                    grant_type: 'authorization_code'
                })
            }
        );

        const body = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error(
                'Spotify token exchange failed:',
                body
            );

            return res.redirect(
                `${FRONTEND_URI}/login?${new URLSearchParams({
                    error: 'invalid_token'
                }).toString()}`
            );
        }

        req.session.spotify = {
            access_token: body.access_token,
            refresh_token: body.refresh_token,
        };

        return res.redirect(
            `${FRONTEND_URI}/`
        );
    } catch (error) {
        console.error('Callback error:', error);

        return res.redirect(
            `${FRONTEND_URI}/login?${new URLSearchParams({
                error: 'server_error'
            }).toString()}`
        );
    }
});

/**
 * POST /refresh_token
 *
 * Body:
 * {
 *   "refresh_token": "..."
 * }
 */
app.post('/refresh_token', async (req, res) => {
    const refresh_token =
        typeof req.body?.refresh_token === 'string'
            ? req.body.refresh_token
            : null;

    if (!refresh_token) {
        return res.status(400).json({
            error: 'missing_refresh_token'
        });
    }

    try {
        const tokenResponse = await fetch(
            'https://accounts.spotify.com/api/token',
            {
                method: 'POST',
                headers: {
                    'Content-Type':
                        'application/x-www-form-urlencoded',
                    Authorization:
                        'Basic ' +
                        Buffer.from(
                            `${CLIENT_ID}:${CLIENT_SECRET}`
                        ).toString('base64')
                },
                body: new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token
                })
            }
        );

        const body = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error(
                'Spotify refresh failed:',
                body
            );

            return res.status(400).json(body);
        }

        return res.json({
            access_token: body.access_token,
            refresh_token:
                body.refresh_token ?? refresh_token
        });
    } catch (error) {
        console.error('Refresh token error:', error);

        return res.status(500).json({
            error: 'failed_to_refresh_token'
        });
    }
});

/**
 * GET /api/me
 * Return current user profile data if authenticated, 401 status otherwise.
 */
app.get("/api/me", async (req, res) => {
    if (!req.session.spotify) return res.status(401).json({});
    const accessToken: string = req.session.spotify.access_token;

    const data: UserProfile = await getProfile(accessToken);
    res.json(data);
});

/**
 * GET /api/me/playlists
 * Return current user's playlists if authenticated, 401 status otherwise.
 */
app.get("/api/me/playlists", async (req, res) => {
    if (!req.session.spotify) return res.status(401).json({});
    const accessToken: string = req.session.spotify.access_token;

    const data = await getUserPlaylists(accessToken);
    res.json(data);
});

app.get('/health', (_req, res) => {
    res.json({
        status: 'ok'
    });
});

app.listen(PORT, () => {
    console.log(
        `Backend listening on port ${PORT}`
    );
});