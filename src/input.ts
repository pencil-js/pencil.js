import BaseEvent from "./base-event.js";
import type { Style } from "./component.js";
import MouseEvent from "./mouse-event.js";
import type Position from "./position.js";
import type { PositionDefinition } from "./position.js";
import Widget, { type WidgetBase, type WidgetOptions } from "./widget.js";

/**
 * Input options
 */
export interface InputOptions extends WidgetOptions {
    /** Color of the background when hovered */
    hover: Style;
}

/**
 * Base class for interactive UI elements
 * @module Input
 */
export abstract class Input<O extends InputOptions = InputOptions> extends Widget<O> {
    static override get className (): string {
        return "Input";
    }

    /**
     * Input constructor
     * @param positionDefinition - Any position
     * @param base - Base shape class for the background
     * @param options - Specific options
     */
    constructor (positionDefinition: PositionDefinition | undefined, base: WidgetBase, options?: Partial<O>) {
        super(positionDefinition, base, options);

        let fill: Style | undefined;
        this.on(MouseEvent.events.hover, () => {
            fill ??= this.options.fill;
            this.options.fill = this.options.hover;
        }).on(MouseEvent.events.leave, () => {
            if (fill !== undefined) {
                this.options.fill = fill;
                fill = undefined;
            }
        }).on(MouseEvent.events.click, (event: MouseEvent) => {
            this.click(this.toLocal(event.position));
        });
    }

    /**
     * Action on click (fire a "change" event by default)
     * @param _position - Click position relative to the input
     */
    click (_position?: Position): void {
        this.fire(new BaseEvent(Input.events.change, this));
    }

    static override get defaultOptions (): InputOptions {
        return {
            ...super.defaultOptions,
            hover: "#dcdcdc",
            cursor: "pointer",
        };
    }

    static override get events () {
        return {
            ...super.events,
            /** Input value has changed */
            change: "change",
        };
    }
}

export default Input;
