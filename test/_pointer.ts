import type Scene from "../src/scene.js";

/**
 * Dispatch a pointer event on a scene's canvas
 * @param scene - Any scene
 * @param type - DOM event type ("pointerdown", "pointermove" …)
 * @param x - Horizontal position
 * @param y - Vertical position
 */
export default function pointer (scene: Scene, type: string, x: number, y: number): void {
    const EventClass = window.PointerEvent ?? window.MouseEvent;
    scene.ctx.canvas.dispatchEvent(new EventClass(type, {
        clientX: x,
        clientY: y,
        bubbles: true,
    }));
}

/**
 * Simulate a drag from a position to another
 * @param scene - Any scene
 * @param from - Starting position
 * @param to - Ending position
 */
export function drag (scene: Scene, from: [number, number], to: [number, number]): void {
    pointer(scene, "pointerdown", ...from);
    pointer(scene, "pointermove", ...to);
    pointer(scene, "pointerup", ...to);
}
