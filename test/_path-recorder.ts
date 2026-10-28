/**
 * Fake Path2D recording every call made on it
 */
export type RecordedPath = Path2D & { calls: Array<[string, ...Array<unknown>]> };

/**
 * Create a fake Path2D recording every call
 */
export default function pathRecorder (): RecordedPath {
    const calls: Array<[string, ...Array<unknown>]> = [];
    return new Proxy({ calls } as unknown as RecordedPath, {
        get (_target, key) {
            if (key === "calls") {
                return calls;
            }
            return (...args: Array<unknown>) => {
                calls.push([String(key), ...args]);
            };
        },
    });
}
