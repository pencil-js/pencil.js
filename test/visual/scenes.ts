/**
 * Small targeted scenes rendered and compared against reference images.
 * Each scene should test one feature, so a failure points directly to what broke.
 */
import {
    Arc,
    Button,
    Checkbox,
    Circle,
    ConicGradient,
    Container,
    Ellipse,
    Heart,
    Image,
    Knob,
    Line,
    LinearGradient,
    NetworkEvent,
    OffScreenCanvas,
    Particles,
    Path,
    Pattern,
    Pie,
    Polygon,
    ProgressBar,
    ProgressPie,
    RadialGradient,
    Rectangle,
    RegularPolygon,
    Select,
    Slider,
    Spline,
    Square,
    Star,
    Text,
    Triangle,
    Color,
} from "../../src/index.js";
import type Scene from "../../src/scene.js";

/**
 * Visual test case
 */
export interface VisualScene {
    /** Canvas width (default 100) */
    width?: number;
    /** Canvas height (default 100) */
    height?: number;
    /** Fill the scene (can be async) */
    draw: (scene: Scene) => void | Promise<void>;
}

/** Font different from the default one, to check the "font" option is applied */
const SERIF = "serif";

const waitReady = (target: Image | Text) => new Promise<void>((resolve) => {
    target.once(NetworkEvent.events.ready, () => resolve());
});

const scenes: Record<string, VisualScene> = {
    // Shapes
    "shape-rectangle": {
        draw: (scene) => {
            scene.add(new Rectangle([10, 10], 80, 50, {
                fill: "#c6426e",
            }));
        },
    },
    "shape-rectangle-rounded": {
        draw: (scene) => {
            scene.add(
                new Rectangle([10, 10], 80, 35, {
                    fill: "#c6426e",
                    rounded: 10,
                }),
                new Rectangle([10, 55], 80, 35, {
                    fill: "#642b73",
                    rounded: [0, 15, 5, 20],
                }),
            );
        },
    },
    "shape-rectangle-origins": {
        width: 130,
        height: 130,
        draw: (scene) => {
            const origins = Object.values(Rectangle.origins);
            // One cell per origin, the red dot is the rectangle's position
            origins.forEach((origin, index) => {
                const position = [25 + ((index % 3) * 40), 25 + (Math.floor(index / 3) * 40)];
                scene.add(new Rectangle(position, 16, 10, {
                    origin,
                    fill: "#c9b6e4",
                }), new Circle(position, 1.5, {
                    fill: "red",
                }));
            });
        },
    },
    "shape-square": {
        draw: (scene) => {
            scene.add(new Square([20, 20], 60, {
                fill: "#2a9d8f",
            }));
        },
    },
    "shape-circle": {
        draw: (scene) => {
            scene.add(new Circle([50, 50], 40, {
                fill: "#e9c46a",
            }));
        },
    },
    "shape-ellipse": {
        draw: (scene) => {
            scene.add(new Ellipse([50, 50], 45, 25, {
                fill: "#f4a261",
            }));
        },
    },
    "shape-arc": {
        draw: (scene) => {
            scene.add(new Arc([50, 50], 40, 30, 0.1, 0.7, {
                stroke: "#e76f51",
                strokeWidth: 8,
            }));
        },
    },
    "shape-pie": {
        draw: (scene) => {
            scene.add(new Pie([50, 50], 40, 0.25, 0.9, {
                fill: "#264653",
            }));
        },
    },
    "shape-heart": {
        draw: (scene) => {
            scene.add(new Heart([50, 50], 40, {
                fill: "#d62828",
            }));
        },
    },
    "shape-polygon": {
        draw: (scene) => {
            scene.add(new Polygon([10, 10], [[0, 0], [80, 20], [60, 80], [10, 50]], {
                fill: "#457b9d",
            }));
        },
    },
    "shape-regular-polygon": {
        draw: (scene) => {
            scene.add(new RegularPolygon([50, 50], 6, 40, {
                fill: "#1d3557",
            }));
        },
    },
    "shape-triangle": {
        draw: (scene) => {
            scene.add(new Triangle([50, 55], 40, {
                fill: "#a8dadc",
            }));
        },
    },
    "shape-star": {
        draw: (scene) => {
            scene.add(new Star([50, 50], 7, 42, 0.4, {
                fill: "#ffb703",
            }));
        },
    },
    "shape-line": {
        draw: (scene) => {
            // Points are relative to the line position
            scene.add(new Line([10, 90], [[20, -70], [50, -20], [80, -80]], {
                strokeWidth: 6,
            }));
        },
    },
    "shape-line-caps-joins": {
        draw: (scene) => {
            const caps = Object.values(Line.caps);
            const joins = Object.values(Line.joins);
            caps.forEach((cap, index) => {
                scene.add(new Line([15, 15 + (index * 30)], [[25, 15], [50, 0]], {
                    cap,
                    join: joins[index],
                    strokeWidth: 10,
                }));
            });
        },
    },
    "shape-line-absolute": {
        draw: (scene) => {
            scene.add(new Line([10, 10], [[90, 50], [10, 90]], {
                absolute: true,
                strokeWidth: 4,
            }));
        },
    },
    "shape-spline": {
        draw: (scene) => {
            scene.add(new Spline([10, 50], [[20, -40], [50, 40], [80, 0]], 0.5, {
                strokeWidth: 4,
            }));
        },
    },
    "path-instructions": {
        draw: (scene) => {
            scene.add(new Path([10, 50], [
                Path.lineTo([20, 0]),
                Path.halfTo([40, 0]),
                Path.quarterTo([60, -20], false),
                Path.quadTo([80, 0], [90, -30]),
                Path.bezierTo([60, 40], [100, 20], [80, 50]),
                Path.splineThrough([[30, 30], [0, 40]], 0.4),
            ], false, {
                strokeWidth: 3,
            }));
        },
    },
    "path-closed": {
        draw: (scene) => {
            scene.add(new Path([20, 20], [
                Path.lineTo([60, 0]),
                Path.lineTo([60, 60]),
                Path.quarterTo([0, 60]),
            ], true, {
                fill: "#8ecae6",
                stroke: "#023047",
            }));
        },
    },
    "path-waves": {
        draw: (scene) => {
            scene.add(
                new Path([10, 30], [Path.waveTo([80, 0], 4)], false, {
                    strokeWidth: 2,
                }),
                new Path([10, 70], [Path.sinTo([80, 0], 2, 10)], false, {
                    strokeWidth: 2,
                }),
            );
        },
    },
    "path-svg-string": {
        draw: (scene) => {
            scene.add(new Path([10, 20], "c 20 -10, 50 -10, 60 20 s 10 60, -40 50", true, {
                fill: "#fb8500",
            }));
        },
    },
    "particles": {
        draw: (scene) => {
            const base = new Star(undefined, 5, 6, 0.5);
            const particles = new Particles([50, 50], base, index => ({
                position: [Math.cos(index) * index * 4, Math.sin(index) * index * 4],
                rotation: index / 10,
                scale: 1 + (index / 10),
            }), undefined, {
                fill: "#9b5de5",
            });
            particles.generate(10);
            scene.add(particles);
        },
    },

    // Styles
    "style-stroke": {
        draw: (scene) => {
            scene.add(new Rectangle([15, 15], 70, 70, {
                fill: "#ffd166",
                stroke: "#06d6a0",
                strokeWidth: 10,
            }));
        },
    },
    "style-dashes": {
        draw: (scene) => {
            Object.values(Line.dashes).forEach((dashed, index) => {
                scene.add(new Line([10, 15 + (index * 22)], [[80, 0]], {
                    dashed,
                    strokeWidth: 3,
                    cap: Line.caps.butt,
                }));
            });
        },
    },
    "style-shadow": {
        draw: (scene) => {
            scene.add(new Circle([45, 45], 30, {
                fill: "#118ab2",
                shadow: {
                    color: "#073b4c",
                    blur: 8,
                    position: [8, 8],
                },
            }));
        },
    },
    "style-color": {
        draw: (scene) => {
            const base = new Color("#ef476f");
            [
                base.clone(),
                base.clone().hue(0.3),
                base.clone().lightness(0.8),
                base.clone().grey(),
                base.clone().reverse(),
                base.clone().lerp("#06d6a0", 0.5),
                new Color(0.2, 0.4, 0.6, 0.5),
                new Color(0x00ff00),
            ].forEach((fill, index) => {
                scene.add(new Square([5 + ((index % 4) * 24), 25 + (Math.floor(index / 4) * 30)], 20, {
                    fill,
                }));
            });
        },
    },
    "style-linear-gradient": {
        draw: (scene) => {
            scene.add(new Square([10, 10], 80, {
                fill: new LinearGradient([0, 0], [80, 80], {
                    0: "#ff006e",
                    0.5: "#ffbe0b",
                    1: new Color("#3a86ff"),
                }),
            }));
        },
    },
    "style-radial-gradient": {
        draw: (scene) => {
            scene.add(new Circle([50, 50], 40, {
                fill: new RadialGradient([-10, -10], 50, {
                    0: "#fff",
                    1: "#8338ec",
                }),
            }));
        },
    },
    "style-conic-gradient": {
        draw: (scene) => {
            scene.add(new Circle([50, 50], 40, {
                fill: new ConicGradient([0, 0], 0, {
                    0: "red",
                    0.33: "lime",
                    0.66: "blue",
                    1: "red",
                }),
            }));
        },
    },
    "style-pattern": {
        draw: (scene) => {
            const tile = new OffScreenCanvas(10, 10, {
                fill: "#fff",
            });
            tile.add(new Square([0, 0], 5, {
                fill: "#e63946",
            }), new Square([5, 5], 5, {
                fill: "#1d3557",
            }));
            scene.add(new Circle([50, 50], 40, {
                fill: new Pattern(tile, {
                    scale: 1.5,
                    origin: [2, 2],
                }),
            }));
        },
    },

    // Transformations
    "transform-rotation": {
        draw: (scene) => {
            scene.add(new Rectangle([50, 50], 60, 20, {
                rotation: 0.125,
                origin: Rectangle.origins.center,
                fill: "#6a4c93",
            }));
        },
    },
    "transform-rotation-center": {
        draw: (scene) => {
            scene.add(new Rectangle([20, 20], 60, 20, {
                rotation: 0.1,
                rotationCenter: [0, 20],
                fill: "#1982c4",
            }));
        },
    },
    "transform-scale": {
        draw: (scene) => {
            scene.add(
                new Square([10, 10], 20, {
                    scale: 2,
                    fill: "#8ac926",
                }),
                new Square([60, 10], 20, {
                    scale: [1, 4],
                    fill: "#ff595e",
                }),
            );
        },
    },
    "transform-origin": {
        draw: (scene) => {
            scene.add(
                new Circle([50, 50], 2, {
                    fill: "red",
                    zIndex: 2,
                }),
                new Square([50, 50], 30, {
                    origin: [-30, -30],
                    fill: "#ffca3a",
                }),
            );
        },
    },
    "transform-nested": {
        draw: (scene) => {
            const parent = new Container([50, 50], {
                rotation: 0.125,
                scale: 1.5,
            });
            const child = new Container([10, 0], {
                rotation: 0.125,
            });
            child.add(new Rectangle([0, 0], 20, 10, {
                fill: "#6a4c93",
            }));
            parent.add(new Circle([0, 0], 3), child);
            scene.add(parent);
        },
    },

    // Containers
    "container-opacity": {
        draw: (scene) => {
            const parent = new Container([0, 0], {
                opacity: 0.5,
            });
            const child = new Square([30, 30], 40, {
                opacity: 0.5,
                fill: "#000",
            });
            parent.add(new Square([10, 10], 40, {
                fill: "#000",
            }), child);
            scene.add(parent);
        },
    },
    "container-z-index": {
        draw: (scene) => {
            const parent = new Square([30, 30], 40, {
                fill: "#219ebc",
            });
            parent.add(
                new Circle([0, 0], 20, {
                    fill: "#fb8500",
                    zIndex: -1,
                }),
                new Circle([40, 40], 20, {
                    fill: "#ffb703",
                }),
            );
            scene.add(parent);
        },
    },
    "container-clip": {
        draw: (scene) => {
            const parent = new Container([0, 0], {
                clip: new Circle([50, 50], 35),
            });
            parent.add(new Rectangle([0, 0], 100, 50, {
                fill: "#e63946",
            }), new Rectangle([0, 50], 100, 50, {
                fill: "#457b9d",
            }));
            scene.add(parent);
        },
    },
    "container-hidden": {
        draw: (scene) => {
            scene.add(
                new Square([10, 10], 30, {
                    fill: "#2a9d8f",
                }),
                new Square([60, 60], 30, {
                    fill: "#e76f51",
                    shown: false,
                }),
            );
        },
    },

    // Render pipeline (context state must never leak from one element to the next)
    "render-state-after-text": {
        width: 160,
        draw: async (scene) => {
            // Underscored text changes the stroke style and line width behind the renderer's back
            const text = new Text([10, 40], "Text", {
                underscore: true,
                fill: "#2a9d8f",
            });
            scene.add(
                new Rectangle([10, 10], 40, 20, {
                    fill: "#e63946",
                    stroke: "#1d3557",
                    strokeWidth: 3,
                }),
                text,
                new Rectangle([10, 70], 40, 20, {
                    fill: "#e63946",
                    stroke: "#1d3557",
                    strokeWidth: 3,
                }),
            );
            await waitReady(text);
        },
    },
    "render-state-after-clip": {
        draw: (scene) => {
            const clipped = new Container([0, 0], {
                clip: new Rectangle([0, 0], 50, 50),
            });
            clipped.add(new Circle([25, 25], 30, {
                fill: "#ffb703",
                stroke: "#000",
                dashed: true,
                strokeWidth: 4,
                shadow: {
                    color: "#000",
                    blur: 4,
                    position: [3, 3],
                },
            }));
            scene.add(clipped, new Rectangle([60, 60], 30, 30, {
                fill: "#ffb703",
                stroke: "#000",
                strokeWidth: 4,
            }));
        },
    },
    "render-state-after-image": {
        draw: async (scene) => {
            const image = new Image([10, 10], "test-30x30.png", {
                fill: "#06d6a0",
                shadow: {
                    color: "#000",
                    blur: 5,
                },
            });
            scene.add(image, new Square([55, 55], 30, {
                fill: "#06d6a0",
            }));
            await waitReady(image);
        },
    },
    "render-state-nested-render": {
        draw: (scene) => {
            // The pattern renders its own canvas while the scene is being rendered
            const tile = new OffScreenCanvas(8, 8, {
                fill: "#fff",
            });
            tile.add(new Square([0, 0], 4, {
                fill: "#8338ec",
                stroke: "#ff006e",
            }));
            scene.add(
                new Square([10, 10], 30, {
                    fill: "#3a86ff",
                    stroke: "#000",
                }),
                new Square([50, 10], 40, {
                    fill: new Pattern(tile),
                }),
                new Square([10, 50], 30, {
                    fill: "#3a86ff",
                    stroke: "#000",
                }),
            );
        },
    },
    "render-state-parent-space": {
        draw: (scene) => {
            // Plain rectangles draw in their (rotated and scaled) parent space with an offset
            const parent = new Container([50, 50], {
                rotation: 0.1,
                scale: [1.5, 1],
            });
            parent.add(
                new Square([-30, -30], 20, {
                    fill: "#fb8500",
                    stroke: "#023047",
                }),
                new Square([10, -30], 20, {
                    fill: "#fb8500",
                    stroke: "#023047",
                    rotation: 0.125,
                }),
                new Square([-30, 10], 20, {
                    fill: new LinearGradient([0, 0], [20, 0], {
                        0: "#fb8500",
                        1: "#023047",
                    }),
                }),
                new Square([10, 10], 20, {
                    fill: "#8ecae6",
                    origin: Rectangle.origins.center,
                    opacity: 0.5,
                }),
            );
            scene.add(parent);
        },
    },
    "render-state-many": {
        width: 200,
        height: 200,
        draw: (scene) => {
            // Many siblings sharing styles, with a few different ones in between
            for (let i = 0; i < 400; ++i) {
                const special = i % 37 === 0;
                scene.add(new Square([(i * 37) % 190, (i * 53) % 190], 6 + (i % 10), {
                    fill: special ? "#e63946" : "white",
                    stroke: special ? null : "black",
                    strokeWidth: 1,
                    dashed: i % 50 === 0,
                }));
            }
        },
    },

    // Text
    "text-default": {
        draw: async (scene) => {
            const text = new Text([10, 10], "Hello");
            scene.add(text);
            await waitReady(text);
        },
    },
    "text-font": {
        draw: async (scene) => {
            const text = new Text([10, 10], "Hello", {
                font: SERIF,
                fontSize: 30,
            });
            scene.add(text);
            await waitReady(text);
        },
    },
    "text-styles": {
        width: 160,
        draw: async (scene) => {
            const texts = [
                new Text([10, 5], "Bold", {
                    bold: true,
                }),
                new Text([10, 30], "Italic", {
                    italic: true,
                    font: SERIF,
                }),
                new Text([10, 55], "Underscore", {
                    underscore: true,
                }),
                new Text([10, 80], "Stroke", {
                    fill: null,
                    stroke: "#c6426e",
                    strokeWidth: 1,
                }),
            ];
            scene.add(...texts);
            await Promise.all(texts.map(waitReady));
        },
    },
    "text-alignments": {
        width: 200,
        height: 120,
        draw: async (scene) => {
            // Lines are aligned inside the text box, the box starts at the text position
            const alignments = [Text.alignments.left, Text.alignments.center, Text.alignments.right];
            const texts = alignments.map((align, index) => new Text([10, 5 + (index * 40)], [align, "longer line"], {
                align,
                fontSize: 16,
            }));
            const boxes = texts.map(text => new Rectangle(text.position, text.width, text.height, {
                fill: null,
                stroke: "red",
                strokeWidth: 1,
            }));
            scene.add(...boxes, ...texts);
            await Promise.all(texts.map(waitReady));
        },
    },
    "text-multiline": {
        width: 160,
        draw: async (scene) => {
            const text = new Text([80, 50], "First line\nSecond\nThird line", {
                lineHeight: 1.5,
                fontSize: 16,
                align: Text.alignments.center,
                origin: Text.origins.center,
                rotation: -0.05,
            });
            scene.add(text);
            await waitReady(text);
        },
    },

    // Image
    "image": {
        draw: async (scene) => {
            const image = new Image([10, 10], "test-40x30.png", {
                stroke: "#000",
            });
            scene.add(image);
            await waitReady(image);
        },
    },
    "image-tint": {
        draw: async (scene) => {
            const image = new Image([50, 50], "test-40x30.png", {
                tint: "#06d6a0",
                origin: Image.origins.center,
                rotation: 0.1,
            });
            scene.add(image);
            await waitReady(image);
        },
    },

    // Widgets
    "widget-button": {
        draw: (scene) => {
            scene.add(new Button([10, 10], {
                value: "Click",
            }), new Button([10, 55], {
                value: "Bold",
                bold: true,
                font: SERIF,
            }));
        },
    },
    "widget-checkbox": {
        draw: (scene) => {
            scene.add(new Checkbox([10, 10]), new Checkbox([50, 10], {
                value: true,
            }), new Checkbox([10, 50], {
                size: 40,
                value: true,
            }));
        },
    },
    "widget-select": {
        width: 120,
        draw: (scene) => {
            scene.add(new Select([10, 10], ["Unicorn", "Doggy", "Cat"], {
                value: 1,
            }));
        },
    },
    "widget-select-open": {
        width: 120,
        height: 140,
        draw: (scene) => {
            // The list is placed so the selected option covers the select
            const select = new Select([10, 50], ["Unicorn", "Doggy", "Cat"], {
                value: 1,
            });
            scene.add(select);
            select.click();
        },
    },
    "widget-slider": {
        width: 220,
        height: 40,
        draw: (scene) => {
            scene.add(new Slider([10, 10], {
                value: 0.7,
            }));
        },
    },
    "widget-progress-bar": {
        width: 220,
        height: 40,
        draw: (scene) => {
            scene.add(new ProgressBar([10, 10], {
                value: 0.7,
                speed: 1,
            }));
        },
    },
    "widget-progress-pie": {
        draw: (scene) => {
            scene.add(new ProgressPie([50, 50], {
                radius: 40,
                value: 0.7,
                speed: 1,
            }));
        },
    },
    "widget-knob": {
        draw: (scene) => {
            scene.add(new Knob([50, 50], {
                radius: 40,
                value: 0.7,
            }));
        },
    },
};

export default scenes;
