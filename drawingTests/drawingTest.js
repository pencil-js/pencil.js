const tests = [
    "allShapes",
];

function defer (func, ctx, ...params) {
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            func.call(ctx, ...params);
        });
    });
}

window.addEventListener("load", () => {
    tests.forEach((name) => {
        const container = document.createElement("div");
        container.id = name;
        container.className = "test";

        const scriptTag = document.createElement("script");
        scriptTag.src = `./${name}/script.js`;

        const scene = document.createElement("div");
        scene.className = "scene";
        window[`${name}Scene`] = scene;
        container.appendChild(scene);

        const expected = document.createElement("img");
        expected.className = "expected";
        expected.src = `./${name}/expected.png`;
        expected.addEventListener("load", () => {
            scene.style.height = `${expected.height}px`;
            scene.style.width = `${expected.width}px`;
            defer(container.appendChild, container, scriptTag);
        });
        expected.addEventListener("error", () => {
            scene.style.height = "200px";
            scene.style.width = "300px";
            container.appendChild(scriptTag);
        });
        container.appendChild(expected);

        document.body.appendChild(container);
    });
});
