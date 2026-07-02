
# Classically

A Spotify companion app that provides playlist tools with smart classical-music shuffling, queueing, and playlist cloning.
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

## Screenshots

<img width="1920" height="1200" alt="image" src="https://github.com/user-attachments/assets/fed025b0-0053-475a-8afc-ed385504e54a" />
<!-- <img width="512" height="370" alt="image" src="https://github.com/user-attachments/assets/a753df90-efa7-4713-be53-9ebc5f621ae4" /> -->
<!-- <img width="512" height="420" alt="image" src="https://github.com/user-attachments/assets/5e8ed5ee-47da-4da6-b38d-7b0ceefd742b" /> -->
<img width="1898" height="452" alt="image" src="https://github.com/user-attachments/assets/38db28e8-b854-41e7-aeee-e6c9c351eff5" />
<img width="1900" height="1198" alt="image" src="https://github.com/user-attachments/assets/476325af-721e-4b19-b9e3-6a3d7fd5599a" />
<!-- <img width="1896" height="1198" alt="image" src="https://github.com/user-attachments/assets/6f8abf20-8786-4801-9714-aa4902ded4b0" /> -->
<img width="1900" height="1198" alt="image" src="https://github.com/user-attachments/assets/bd1515b8-47a4-42b7-9b8d-f75b68e2ca1c" />


## Spotify API Restrictions

Due to Spotify's [Web API quota and development policies](https://developer.spotify.com/documentation/web-api/concepts/quota-modes), Classically currently operates in **Development Mode**. As a result, only Spotify accounts explicitly added to the application's allowlist can access Spotify Web API data.

These restrictions make it impractical to provide as a publicly accessible service. For this reason, Classically is distributed primarily as a GitHub project intended to be run locally with a personal Spotify Developer application.

The broader impact of these policy changes on independent developers can be read [here](https://spotify.leemartin.com/).

## Quick Start

**Before you begin, you'll need:**

- Node.js 24+ and npm 11+
- A Spotify Premium account
- A [Spotify Developer app](https://developer.spotify.com/dashboard)

**1. Create your Spotify Developer app**
 
In the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard), create a new app. Under Redirect URIs, add:
 
```
http://127.0.0.1:8080/callback
```

Copy the **Client ID** and **Client Secret**.

**2. Clone and install:**

```bash
git clone https://github.com/cxbcheng/qspot.git
cd qspot
npm install
```

**3. Configure your environment:**

Create a `.env` file in the root directory:

```env
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SESSION_SECRET=

VITE_BACKEND_URI=http://127.0.0.1:8080
REDIRECT_URI=http://127.0.0.1:8080/callback
FRONTEND_URI=http://127.0.0.1:5173

PORT=8080
NODE_ENV=development
```

Paste in the **Client ID** and **Client Secret** from step 1, and set `SESSION_SECRET` to any random string.

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

**4. Run it:**

```bash
npm run dev
```

The app will be available at:
- Frontend: http://127.0.0.1:5173
- Backend: http://127.0.0.1:8080

## License

Distributed under MIT License. See `LICENSE.txt` for more information.
## Contact

Christian Cheng - [@cxbcheng](https://www.github.com/cxbcheng) - [LinkedIn](www.linkedin.com/in/christian-cheng-159964372)

Project Link: https://github.com/cxbcheng/qspot
