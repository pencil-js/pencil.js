const tests = [
    "allShapes",
    "allInputs",
];

/**
 * Wait next tick to call a function
 * @param {Function} func - Any function to defer
 * @param {*} ctx - This context of the function
 * @param {...*} params - Some params
 */
function defer (func, ctx, ...params) {
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            func.apply(ctx, params);
        });
    });
}

window.addEventListener("load", () => {
    let chain = Promise.resolve();

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
        chain = chain.then(() => {
            return new Promise((resolve) => {
                console.log(`Load ${name}`);
                expected.src = `./${name}/expected.png`;
                expected.addEventListener("load", () => {
                    scene.style.height = `${expected.height}px`;
                    scene.style.width = `${expected.width}px`;
                    defer(() => {
                        container.appendChild(scriptTag);
                        console.log(`Resolve ${name}`);
                        resolve();
                    });
                });
                expected.addEventListener("error", () => {
                    scene.style.height = "200px";
                    scene.style.width = "50%";
                    container.appendChild(scriptTag);
                    console.log(`Fail ${name}`);
                    resolve();
                });
            });
        });
        container.appendChild(expected);

        document.body.appendChild(container);
    });
});
