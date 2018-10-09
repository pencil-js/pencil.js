import browserEnv from "browser-env";

browserEnv(["window"]);

global.Path2D = class Path2D {
    rect () {}
};

window.HTMLCanvasElement.prototype.getContext = function getContext () {
    const noop = () => {};
    return {
        canvas: this,
        clearRect: noop,
        getImageData: noop,
        putImageData: noop,
        save: noop,
        restore: noop,
        translate: noop,
        rotate: noop,
        scale: noop,
        measureText: () => ({
            width: 1,
            emHeightAscent: 2,
            emHeightDescent: 3,
        }),
    };
};
window.HTMLCanvasElement.prototype.toDataURL = type => type;
