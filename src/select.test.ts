import { test, expect, beforeEach } from "vitest";


let context: any;
import MouseEvent from "./mouse-event.js";
import Select from "./select.js";

beforeEach(() => {
    context = new Select([0, 0], [
        undefined, "B", "C",
    ], {
        value: 1,
    });
});

test("constructor", () => {
    expect(context.optionsList.length).toBe(3);
    context.optionsList.forEach(option => expect(option.constructor.name).toBe("Text"));
    expect(context.optionsContainer.options.shown).toBe(false);

    expect(() => new Select([0, 0], [])).toThrow();
});

test("option events", () => {
    context.value = 1;

    const firstOption = context.optionsList[0];

    firstOption.fire(new MouseEvent(MouseEvent.events.click, firstOption));
    expect(context.value).toBe(0);

    firstOption.fire(new MouseEvent(MouseEvent.events.hover, firstOption));
    expect(firstOption.parent.options.fill).toBe(context.options.hover);

    firstOption.fire(new MouseEvent(MouseEvent.events.leave, firstOption));
    expect(firstOption.parent.options.fill).toBe(context.options.fill);
});

test("get and set value", () => {
    context.value = 5;
    expect(context.value).toBe(2);
    expect(context.display.text).toBe("C");
});

test("click", () => {
    context.click();
    expect(context.optionsContainer.options.shown).toBe(true);

    context.optionsContainer.hide();

    context.display.fire(new MouseEvent(MouseEvent.events.click, context.display));
    expect(context.optionsContainer.options.shown).toBe(true);
});

test("toJSON", () => {
    const json = context.toJSON();
    expect(json.values).toEqual(["", "B", "C"]);
});

test("from", () => {
    const definition = {
        position: [1, 2],
        values: ["1", "2", "3"],
        options: {
            value: 1,
        },
    };
    const select = Select.from(definition);
    expect(select.optionsList.length).toBe(3);
    expect(select.options.value).toBe(1);
});

test("MARGIN", () => {
    expect(Select.MARGIN).toBe(0.2);
});
