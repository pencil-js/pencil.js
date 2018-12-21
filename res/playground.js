requestAnimationFrame(() => {
    const examples = document.querySelectorAll(".example");

    let promiseChain = Promise.resolve();
    Array.prototype.forEach.call(examples, (example) => {
        const url = `./examples/${example.id}.js`;
        promiseChain = promiseChain.then(() => fetch(url).then((response) => {
            if (response.ok) {
                return response.text();
            }

            return Promise.reject(new URIError(`Unreachable url ${url}`));
        })).then((code) => {
            const codeElm = document.createElement("pre");
            codeElm.classList.add("javascript");
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
            wrapper.appendChild(scriptTag);
        }).then(() => new Promise((resolve) => {
            setTimeout(resolve, 100);
        }));
    });
});
