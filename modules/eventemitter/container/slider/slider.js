import Container from "../container";
import Rectangle from "../shapes/rectangle";
import Circle from "../shapes/circle";
import Vector from "../vector";
import Position from "../position";
import BaseEvent from "../../events/base";

/**
 * @typedef {Object} SliderOptions
 * @extends ContainerOptions
 * @prop {Number} [min=0] - Minimum value when the slider is at lowest
 * @prop {Number} [max=10] -
 * @prop {Number [width=200]
 * @prop {String} [fill="#F00"] -
 * @prop {String} [background="#FFF"] -
 */

/**
 * Slider class
 * @class
 * @extends Container
 */
export default class Slider extends Container {
    /**
     * Slider constructor
     * @param {Position} position -
     * @param {SliderOptions} options -
     */
    constructor(position, options) {
        super(position, options);

        let sliderHeight = Slider.HEIGHT;
        this.background = new Rectangle(undefined, this.width, sliderHeight, {
            fill: this.options.background
        });
        this.addChild(this.background);

        this.container = new Container(new Position(sliderHeight / 2, sliderHeight / 2));
        this.addChild(this.container);
        this.handle = new Circle(new Position(0, 0), sliderHeight / 2, {
            fill: this.options.fill,
            cursor: "ew-resize"
        });
        this.container.addChild(this.handle);
        this.handleDragAPI = this.handle.draggable({
            constrain: new Vector(new Position(0, 0), new Position(this.width - sliderHeight, 0))
        });
        this.handle.on("drag", () => this.fire(new BaseEvent(this, "change")), true);
    }

    set width(newWidth) {
        if (newWidth < Slider.HEIGHT) {
            throw new RangeError(`Slider is too small, minimum is ${Slider.HEIGHT}`);
        }

        let value = this.value;
        this.options.width = newWidth;
        this.background.width = newWidth;
        this.handleDragAPI.constrain = new Vector(new Position(0, 0), new Position(this.width - Slider.HEIGHT, 0));
        this.value = value;
    }

    get width() {
        return this.options.width;
    }

    /**
     * Returns this current value
     * @return {Number}
     */
    get value() {
        return this.options.min + (this.options.max - this.options.min) * (this.handle.position.x / (this.width - Slider.HEIGHT));
    }

    /**
     * Change this current value
     * @param {Number} newValue
     * @return {Number} Real value used (between min and max)
     */
    set value(newValue) {
        let minmaxValue = Math.max(this.options.min, Math.min(this.options.max, newValue));
        this.handle.position.x = (this.width - Slider.HEIGHT) * (minmaxValue / (this.options.max - this.options.min));
        this.fire(new BaseEvent(this, "change"));
        return minmaxValue;
    }

    /**
     * @return {SliderOptions}
     */
    static get defaultOptions() {
        return Object.assign({
            min: 0,
            max: 10,
            width: 200,
            fill: "#F00",
            background: "#FFF"
        }, super.defaultOptions);
    }

    static get HEIGHT() {
        return 30;
    }
}