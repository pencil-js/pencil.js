/* globals Benchmark */
/* eslint-disable import/extensions */
import "../node_modules/lodash/lodash.js";
import "../node_modules/benchmark/benchmark.js";

const select1 = document.getElementById("select1");
const select2 = document.getElementById("select2");
const go = document.getElementById("go");
const loader = document.getElementById("loader");
const c1 = document.getElementById("c1");
const c2 = document.getElementById("c2");
const results = document.getElementById("results");

const sizeCanvas = (canvas) => {
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
};
sizeCanvas(c1);
sizeCanvas(c2);

const test = (Pencil, canvas, squares) => {
    const { Scene, Square } = Pencil;

    const scene = new Scene(canvas, {
        fill: "#aaa",
    });

    const children = squares.map(sq => new Square(sq.position, 50, sq.options));

    scene
        .add(...children)
        .render();
};

const getUrl = value => (value === "local" ? "../dist/pencil.esm.js" : `https://unpkg.com/pencil.js@${value}/dist/pencil.esm.js`);

const getColor = (colors = [
    "red",
    "green",
    "blue",
    "yellow",
    "black",
    "white",
]) => colors[Math.floor(Math.random() * colors.length)];

go.addEventListener("click", async () => {
    loader.classList.remove("hidden");
    const P1 = await import(getUrl(select1.value));
    const P2 = await import(getUrl(select2.value));

    const squares = [...new Array(111)].map(() => ({
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

    const suite = new Benchmark.Suite("Create and render scene");
    suite.add(select1.value, test.bind(null, P1, c1, squares));
    suite.add(select2.value, test.bind(null, P2, c2, squares));

    results.innerHTML = "";
    suite
        .on("complete", () => {
            console.log("Test complet");
            suite.forEach((t) => {
                const res = document.createElement("li");
                res.textContent = t.toString();
                results.appendChild(res);
            });
            loader.classList.add("hidden");
        })
        .run();
});

const listVersions = async () => {
    const response = await fetch("https://thingproxy.freeboard.io/fetch/http://registry.npmjs.com/pencil.js");
    if (response.ok) {
        const data = await response.json();
        return data.versions;
    }
    throw new Error("Fail to fetch versions");
};

const createList = async () => {
    const versions = await listVersions();
    versions.local = {
        module: true,
    };
    Object.keys(versions).reverse().forEach((version) => {
        if (versions[version].module) {
            const option = document.createElement("option");
            option.textContent = version;
            option.value = version;
            select1.appendChild(option);
            select2.appendChild(option.cloneNode(true));
        }
    });
    loader.classList.add("hidden");
};

createList();
