import test from "ava";
import Select from "./select";

test.beforeEach((t) => {
    t.context = new Select([0, 0], [
        "A", "B", "C",
    ], {
        value: 1,
    });
});

test("constructor", (t) => {
    t.is(t.context.optionsList.length, 3);
    t.context.optionsList.forEach(option => t.is(option.constructor.name, "Text"));
    t.false(t.context.optionsContainer.options.shown);
});

test("get and set value", (t) => {
    t.context.value = 5;
    t.is(t.context.value, 2);
    t.is(t.context.display.text, "C");
});

test("click", (t) => {
    t.context.click();
    t.true(t.context.optionsContainer.options.shown);
});

test("MARGIN", (t) => {
    t.is(Select.MARGIN, 0.2);
});
