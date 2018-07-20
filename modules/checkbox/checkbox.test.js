/* global describe beforeEach test expect */

import Checkbox from "./checkbox";

describe("Checkbox", () => {
    let checkbox;
    beforeEach(() => {
        checkbox = new Checkbox([100, 100]);
    });

    test("creation", () => {
        expect(checkbox.fill).toBeDefined();
        expect(!!checkbox.fill.options.shown).toBe(!!checkbox.options.value);
    });

    test("click and toggle", () => {
        checkbox.value = true;
        checkbox.click();
        expect(checkbox.value).toBe(false);
        checkbox.click();
        expect(checkbox.value).toBe(true);

        checkbox.toggle();
        expect(checkbox.value).toBe(false);
        checkbox.toggle();
        expect(checkbox.value).toBe(true);

        checkbox.toggle(true);
        expect(checkbox.value).toBe(true);
        checkbox.toggle(false);
        expect(checkbox.value).toBe(false);
    });

    test("get and set value", () => {
        expect(!!checkbox.value).toBe(!!checkbox.fill.options.shown);
        checkbox.value = true;
        expect(checkbox.fill.options.shown).toBe(true);
        checkbox.value = false;
        expect(checkbox.fill.options.shown).toBe(false);
    });

    describe("statics", () => {
        test("defaultOptions", () => {
            const options = Checkbox.defaultOptions;
            expect(options.size).toBe(20);
        });

        test("MARGIN", () => {
            expect(Checkbox.MARGIN).toBeCloseTo(0.2);
        });
    });
});
