window.addEventListener("load", () => {
    const examples = document.querySelectorAll(".example");

    const scripts = [];
    Promise.all(Array.prototype.map.call(examples, (example) => {
        const url = `./examples/${example.id}.js`;
        return fetch(url).then((response) => {
            if (response.ok) {
                return response.text();
            }

            return Promise.reject(new URIError(`Unreachable url ${url}`));
        }).then((code) => {
            const codeElm = document.createElement("pre");
            codeElm.textContent = code;
            example.appendChild(codeElm);
            hljs.highlightBlock(codeElm);

            const wrapper = document.createElement("div");
            wrapper.className = "scene";
            example.appendChild(wrapper);
            const scriptTag = document.createElement("script");
            scriptTag.textContent = `{
                const wrapper = document.querySelector("#${example.id} .scene");
                ${code}
            }`;
            scripts.push({
                tag: scriptTag,
                wrapper,
            });
        });
    })).then(() => {
        scripts.forEach(script => script.wrapper.appendChild(script.tag));
    });
});
