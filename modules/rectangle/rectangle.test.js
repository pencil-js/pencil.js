/* global test expect */

import Rectangle from "./rectangle";

test("Rectangle creation and trace", () => {
    const w = 123;
    const h = 22.2;
    const rect = new Rectangle([-20, 20], w, h);

    expect(rect.width).toBe(w);
    expect(rect.height).toBe(h);

    const path = new Path2D();
    rect.trace(path);
    expect(path.rect.mock.calls.length).toBe(1);
    expect(path.rect.mock.calls[0]).toEqual([-0, -0, w, h]);
});
