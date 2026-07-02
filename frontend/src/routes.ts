import Root, {ErrorBoundary} from "./root.tsx";

export default [
    {
        path: "/",
        Component: Root,
        ErrorBoundary,
        children: [
            {
                index: true,
                lazy: () => import("./routes/home"),
            },
            {
                path: "*",
                lazy: () => import("./routes/not-found"),
            },
        ],
    },
    {
        path: "/playlists/:playlistId",
        lazy: () => import("./routes/playlist"),
    },
    {
        path: "/login",
        Component: Root,
        children: [
            {
                index: true,
                lazy: () => import("./routes/login"),
            }
        ]
    },
    {
        path: "/setup/spotify",
        lazy: () => import("./routes/setup-spotify.tsx"),
    }
];