import Root from "./root.tsx";

export default [
    {
        path: "/",
        Component: Root,
        children: [
            {
                index: true,
                lazy: () => import("./routes/home"),
            },
        ],
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
    }
];