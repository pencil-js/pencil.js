import test from "ava";
import MouseEvent from "../mouse-event/mouse-event";
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

test("option events", (t) => {
    t.context.value = 1;
    const firstOption = t.context.optionsList[0];
    firstOption.fire(new MouseEvent(firstOption, MouseEvent.events.click));

    t.is(t.context.value, 0);
});

test("get and set value", (t) => {
    t.context.value = 5;
    t.is(t.context.value, 2);
    t.is(t.context.display.text, "C");
});

test("click", (t) => {
    t.context.click();
    t.true(t.context.optionsContainer.options.shown);

    t.context.optionsContainer.hide();

    t.context.display.fire(new MouseEvent(t.context.display, MouseEvent.events.click));
    t.true(t.context.optionsContainer.options.shown);
});

test("MARGIN", (t) => {
    t.is(Select.MARGIN, 0.2);
});
