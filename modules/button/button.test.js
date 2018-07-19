/* global describe beforeEach test expect */

import Button from "./button";

describe("Button", () => {
    let button;
    beforeEach(() => {
        button = new Button([100, 100], {
            value: "button text",
        });
    });

    test("creation", () => {
        expect(button.text).toBeDefined();
        ["fill", "font", "fontSize", "bold", "italic"].forEach((prop) => {
            expect(button.text.options[prop]).toBe(button.options[prop]);
        });
    });

    test("get and set value", () => {
        expect(button.value).toBe(button.text.text);

        button.value = "test";
        expect(button.text.text).toBe("test");
    });

    describe("statics", () => {
        test("defaultOptions", () => {
            const options = Button.defaultOptions;
            expect(options.value).toBe("");
            ["font", "fontSize", "bold", "italic"].forEach((prop) => {
                expect(options[prop]).toBe(button.text.constructor.defaultOptions[prop]);
            });
        });

        test("MARGIN", () => {
            expect(Button.MARGIN).toBeCloseTo(0.2);
        });
    });
});
