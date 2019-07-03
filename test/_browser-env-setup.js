import browserEnv from "browser-env";

browserEnv(["window", "document"], {
    pretendToBeVisual: true,
});

window.Path2D = class Path2D {
    rect () {}

    arc () {}

    moveTo () {}

    ellipse () {}
};

window.DOMMatrix = class DOMMatrix {
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
        setTransform: noop,
        measureText: () => ({
            width: 5,
        }),
    };
};
window.HTMLCanvasElement.prototype.toDataURL = type => type;
