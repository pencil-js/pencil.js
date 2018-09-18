import browserEnv from "browser-env";

browserEnv(["window"]);

global.Path2D = class Path2D {
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
    };
};
window.HTMLCanvasElement.prototype.toDataURL = type => type;
