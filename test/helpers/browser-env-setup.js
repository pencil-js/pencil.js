import browserEnv from "browser-env";

browserEnv(["window"], {
    pretendToBeVisual: true,
});

window.Path2D = class Path2D {
    rect () {}
};

window.document.fonts = new Set();

window.FontFace = class FontFace {
    load () {
        return new Promise((resolve) => {
            setTimeout(resolve, 50);
        });
    }
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
