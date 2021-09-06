/* global Pencil */

{
    const P = Pencil;

    const scene = new P.Scene(window.allShapesScene, {
        fill: "rgba(200, 200, 200, 0.3)",
    });

    const shapes = [];

    shapes.push(new P.Arc([40, 30], 30, 20, 0.25, -0.1, {
        fill: "#F00",
        strokeWidth: 8,
    }));

    const container = new P.Container([30, 20], {
        opacity: 0.5,
    });

    const rect = new P.Rectangle([60, 0], 70, 50, {
        rotation: 0.125,
        rotationCenter: [25, 20],
    });

    const base = new P.Heart(undefined, 9, {
        fill: "#a70084",
    });
    const particles = new P.Particles(undefined, base, i => ({
        position: new P.Position(11, 22).add(i * P.Math.phi * 52).modulo([70, 50]),
        rotation: P.Math.phi * i,
    }));
    particles.generate(9);
    rect.add(particles);

    container.add(new P.Circle([0, 60], 20, {
        fill: "gold",
    }), rect);

    shapes.push(container);

    shapes.push(new P.Star([100, 100], 5, 20));

    shapes.push(new P.RegularPolygon([100, 100], 5, 20, {
        fill: null,
        stroke: "rgb(0, 0, 255)",
    }));

    const points = [
        [30, 50],
        [50, 30],
        [0, 40],
    ];

    shapes.push(new P.Polygon([20, 80], [[0, 0], ...points], {
        fill: null,
        stroke: "#111",
        strokeWidth: 8,
    }));

    shapes.push(new P.Line([20, 130], points, {
        strokeWidth: 4,
        cap: P.Line.caps.butt,
    }));
    shapes.push(new P.Spline([70, 130], points, 0.5, {
        strokeWidth: 4,
    }));

    const text = new P.Text([170, 150], "test\n🦄", {
        fontSize: 40,
        align: P.Text.alignments.center,
        origin: P.Text.origins.center,
        bold: true,
        italic: true,
        underscore: true,
        font: "https://fonts.gstatic.com/s/indieflower/v9/m8JVjfNVeKWVnh3QMuKkFcZVaUuH.woff2",
        lineHeight: 1.3,
        rotation: -1 / 15,
    });
    shapes.push(text);

    shapes.push(new P.Square([160, 100], 50, {
        zIndex: 0,
        origin: [-25, 0],
        fill: new P.LinearGradient(undefined, [50, 50], {
            0: "green",
            1: "#f78200",
        }),
    }));

    shapes.push(new P.Path([140, 30], [
        P.Path.lineTo([20, 0]),
        P.Path.halfTo([40, 0]),
        P.Path.quarterTo([60, -20], false),
        P.Path.splineThrough([
            [60, 50],
            [0, 50],
        ], 0.4),
    ], false, {
        stroke: "hsl(210, 100%, 50%)",
        strokeWidth: 6,
        shadow: {
            blur: 6,
            color: "red",
            position: [4, 0],
        },
    }));

    scene.add(...shapes);

    text.on(P.NetworkEvent.events.ready, () => scene.render());
}
