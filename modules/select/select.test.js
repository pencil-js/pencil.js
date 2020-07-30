import test from "ava";
import MouseEvent from "../mouse-event";
import Select from ".";

test.beforeEach((t) => {
    t.context = new Select([0, 0], [
        undefined, "B", "C",
    ], {
        value: 1,
    });
});

test("constructor", (t) => {
    t.is(t.context.optionsList.length, 3);
    t.context.optionsList.forEach(option => t.is(option.constructor.name, "Text"));
    t.false(t.context.optionsContainer.options.shown);

    t.throws(() => new Select([0, 0], []));
});

test("option events", (t) => {
    t.context.value = 1;

    const firstOption = t.context.optionsList[0];

    firstOption.fire(new MouseEvent(MouseEvent.events.click, firstOption));
    t.is(t.context.value, 0);

    firstOption.fire(new MouseEvent(MouseEvent.events.hover, firstOption));
    t.is(firstOption.parent.options.fill, t.context.options.hover);

    firstOption.fire(new MouseEvent(MouseEvent.events.leave, firstOption));
    t.is(firstOption.parent.options.fill, t.context.options.fill);
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

    t.context.display.fire(new MouseEvent(MouseEvent.events.click, t.context.display));
    t.true(t.context.optionsContainer.options.shown);
});

test("toJSON", (t) => {
    const json = t.context.toJSON();
    t.deepEqual(json.values, ["", "B", "C"]);
});

test("from", (t) => {
    const definition = {
        position: [1, 2],
        values: ["1", "2", "3"],
        options: {
            value: 1,
        },
    };
    const select = Select.from(definition);
    t.is(select.optionsList.length, 3);
    t.is(select.options.value, 1);
});

test("MARGIN", (t) => {
    t.is(Select.MARGIN, 0.2);
});
