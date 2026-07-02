import { useState } from "react";

export function useAsyncLock() {
    const [locked, setLocked] = useState(false);

    async function run<T>(fn: () => Promise<T>) {
        if (locked) return;
        setLocked(true);

        try {
            return await fn();
        } finally {
            setLocked(false);
        }
    }

    return { locked, run };
}