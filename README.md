
# QSpot

A Spotify companion app that provides classical-music helper tools for playlists with smart classical-music shuffling, queueing, and playlist cloning.
## Built With

[![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](https://react.dev)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=react-router&logoColor=white)](https://reactrouter.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)](https://vite.dev/)
[![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB)](https://expressjs.com/)
[![Spotify](https://img.shields.io/badge/Spotify-1ED760?logo=spotify&logoColor=white)](https://developer.spotify.com/)
## Features

- **Classical Shuffle**: Randomizes the order of classical works using the Fisher-Yates algorithm while preserving the order of movements within each work.
- **Classical Metadata Extraction**: Groups tracks into works by parsing Spotify metadata to extract work titles (e.g. Piano Concerto No. 2 in C Minor), opus numbers, catalogue numbers (e.g. BWV, KV, Hob.), composer name, and album context.
- **Shuffle Preview**: Preview a shuffle ordering before playing the desired order or making a new playlist.
- **Playlist Creation**: Generate a new Spotify playlist containing the shuffled order. The original playlist remains unchanged.
- **Secure Authentication**: Use Spotify OAuth 2.0 along with server-side sessions so access tokens remain on the backend.
## Spotify API Restrictions

Due to Spotify's [Web API quota and development policies](https://developer.spotify.com/documentation/web-api/concepts/quota-modes), QSpot currently operates in **Development Mode**. As a result, only Spotify accounts explicitly added to the application's allowlist can access Spotify Web API data.

These restrictions make it impractical to provide as a publicly accessible service. For this reason, QSpot is distributed primarily as a GitHub project intended to be run locally with a personal Spotify Developer application.

The broader impact of these policy changes on independent developers can be read [here](https://spotify.leemartin.com/).
## Screenshots

<img width="1920" height="1200" alt="App Login Page" src="https://github.com/user-attachments/assets/d7e0a2a2-df71-49f6-9acc-c52f83be1522" />
<img width="1896" height="1198" alt="App Playlist View" src="https://github.com/user-attachments/assets/29e1629d-7b9a-4ffb-9c3e-d015f40c8b4c" />
<img width="1920" height="1200" alt="Classical Shuffle Playlist Demo" src="https://i.imgur.com/f5mCUb6.gif" />

## Installation

Before installing QSpot, ensure you have:

- Node.js 24+
- npm 11+
- A Spotify Premium account
- A Spotify Developer application

> **Note:** QSpot currently relies on Spotify Web API playback endpoints, which require a Spotify Premium account.

Clone the repository:

```bash
  git clone https://github.com/cxbcheng/qspot.git
```

Install project dependencies:

```bash
  cd qspot
  npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
SESSION_SECRET=replace-with-a-random-secret

VITE_BACKEND_URI=http://127.0.0.1:8080
REDIRECT_URI=http://127.0.0.1:8080/callback
FRONTEND_URI=http://127.0.0.1:5173

PORT=8080
NODE_ENV=development
```

| Variable | Purpose |
| - | - |
| `SPOTIFY_CLIENT_ID` | Spotify application Client ID |
| `SPOTIFY_CLIENT_SECRET` | Spotify application Client Secret |
| `SESSION_SECRET` | Express session secret |
| `VITE_BACKEND_URI` | Backend API URL used by the React frontend |
| `REDIRECT_URI` | Spotify OAuth callback URL |
| `FRONTEND_URI` | React application's URL |
| `PORT` | Backend server port |
| `NODE_ENV` | Runtime environment |


Create a Spotify application in the Spotify Developer Dashboard and configure the Redirect URI:

`http://127.0.0.1:8080/callback`

Then copy the Client ID and Client Secret into the `.env` file.

> **Development Mode**
>
> Spotify applications begin in Development Mode. Only Spotify users added to the application's allowlist can access API data. Other users may authenticate successfully, but Spotify API requests will return `HTTP 403` responses.
## Run Locally

After installation, run the server:

```bash
  npm run dev
```

The application will be available at:

- Frontend: http://127.0.0.1:5173
- Backend: http://127.0.0.1:8080
## License

Distributed under MIT License. See `LICENSE.txt` for more information.
## Contact

Christian Cheng - [@cxbcheng](https://www.github.com/cxbcheng) - [LinkedIn](www.linkedin.com/in/christian-cheng-159964372)

Project Link: https://github.com/cxbcheng/qspot
