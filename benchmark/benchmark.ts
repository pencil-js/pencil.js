/**
 * Compare the local version of Pencil.js against any published version
 * Run with "npm run bench"
 */
import type * as PencilModuleType from "../src/index.js";

type PencilModule = typeof PencilModuleType;

const select1 = document.getElementById("select1") as HTMLSelectElement;
const select2 = document.getElementById("select2") as HTMLSelectElement;
const go = document.getElementById("go") as HTMLButtonElement;
const loader = document.getElementById("loader") as HTMLElement;
const c1 = document.getElementById("c1") as HTMLCanvasElement;
const c2 = document.getElementById("c2") as HTMLCanvasElement;
const results = document.getElementById("results") as HTMLUListElement;

const DURATION = 2000;

const sizeCanvas = (canvas: HTMLCanvasElement) => {
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
};
sizeCanvas(c1);
sizeCanvas(c2);

interface SquareData {
    position: [number, number];
    options: Record<string, unknown>;
}

const run = (Pencil: PencilModule, canvas: HTMLCanvasElement, squares: Array<SquareData>) => {
    const { Scene, Square } = Pencil;

    const scene = new Scene(canvas, {
        fill: "#aaa",
    });

    const children = squares.map(sq => new Square(sq.position, 50, sq.options));

    scene
        .add(...children)
        .render();

    scene.destroy?.();
};

/**
 * Run a function as many time as possible and return the number of operations per second
 * @param fn - Function to measure
 */
const measure = async (fn: () => void): Promise<number> => {
    // Warm-up
    for (let i = 0; i < 10; ++i) {
        fn();
    }
    let count = 0;
    const start = performance.now();
    while (performance.now() - start < DURATION) {
        fn();
        count++;
        // Let the browser breathe
        if (count % 20 === 0) {
            await new Promise(resolve => setTimeout(resolve));
        }
    }
    return count / ((performance.now() - start) / 1000);
};

const getUrl = (value: string) => (value === "local" ? "../src/index.ts" : `https://unpkg.com/pencil.js@${value}/dist/pencil.esm.js`);

const getColor = (colors = ["red", "green", "blue", "yellow", "black", "white"]) => colors[Math.floor(Math.random() * colors.length)];

go.addEventListener("click", async () => {
    loader.classList.remove("hidden");
    const P1 = await import(/* @vite-ignore */ getUrl(select1.value));
    const P2 = await import(/* @vite-ignore */ getUrl(select2.value));

    const squares: Array<SquareData> = Array.from({ length: 111 }, () => ({
        position: [Math.random() * c1.width, Math.random() * c1.height],
        options: {
            fill: getColor(),
            stroke: getColor(),
            strokeWidth: 10,
            opacity: Math.random(),
            rotation: Math.random(),
            shadow: {
                position: [10, 10],
                blur: 20,
                color: "#333",
            },
            origin: "center",
            shown: Math.random() < 0.1,
        },
    }));

    results.innerHTML = "";
    for (const [name, module, canvas] of [[select1.value, P1, c1], [select2.value, P2, c2]] as const) {
        const ops = await measure(() => run(module, canvas, squares));
        const item = document.createElement("li");
        item.textContent = `${name}: ${ops.toFixed(1)} ops/sec`;
        results.appendChild(item);
    }
    loader.classList.add("hidden");
});

const createList = async () => {
    const response = await fetch("https://registry.npmjs.org/pencil.js");
    const { versions } = await response.json() as { versions: Record<string, { module?: string }> };
    const list = ["local", ...Object.keys(versions).filter(version => versions[version].module).reverse()];
    for (const version of list) {
        const option = document.createElement("option");
        option.textContent = version;
        option.value = version;
        select1.appendChild(option);
        select2.appendChild(option.cloneNode(true));
    }
    select2.selectedIndex = 1;
    loader.classList.add("hidden");
};

createList();
