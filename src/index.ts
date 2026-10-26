/**
 * Nice modular interactive 2D drawing library.
 * @packageDocumentation
 */

// Basics
import Position from "./position.js";
import Vector from "./vector.js";
import * as Math from "./math.js";
import OffScreenCanvas from "./offscreen-canvas.js";
import Color from "./color.js";
import LinearGradient from "./linear-gradient.js";
import RadialGradient from "./radial-gradient.js";
import ConicGradient from "./conic-gradient.js";
import Pattern from "./pattern.js";
import * as Navigation from "./navigation.js";
import { from as revive, register, type Definition } from "./serialization.js";

// Events
import BaseEvent from "./base-event.js";
import MouseEvent from "./mouse-event.js";
import NetworkEvent from "./network-event.js";
import KeyboardEvent from "./keyboard-event.js";

// Trunk
import EventEmitter from "./event-emitter.js";
import Container from "./container.js";
import Scene from "./scene.js";
import Component from "./component.js";
import Particles from "./particles.js";

// Shapes
import Arc from "./arc.js";
import Pie from "./pie.js";
import Ellipse from "./ellipse.js";
import Circle from "./circle.js";
import Line from "./line.js";
import Spline from "./spline.js";
import Polygon from "./polygon.js";
import RegularPolygon from "./regular-polygon.js";
import Triangle from "./triangle.js";
import Star from "./star.js";
import Rectangle from "./rectangle.js";
import Square from "./square.js";
import Image from "./image.js";
import Text from "./text.js";
import Path, { Instruction } from "./path.js";
import Heart from "./heart.js";
import Sprite, { Spritesheet } from "./sprite.js";

// Complex
import Widget from "./widget.js";
import Input from "./input.js";
import Button from "./button.js";
import Checkbox from "./checkbox.js";
import Select from "./select.js";
import Slider from "./slider.js";
import ProgressBar from "./progress-bar.js";
import ProgressPie from "./progress-pie.js";
import Knob from "./knob.js";

// Interactions (add methods to Component and Rectangle)
import "./draggable.js";
import "./resizable.js";
import "./rotatable.js";

/**
 * Version of the library
 */
export const version: string = typeof __PENCIL_VERSION__ === "undefined" ? "dev" : __PENCIL_VERSION__;

/**
 * Author of the library
 */
export const author = "Guillaume Martigny <guillaume.martigny@gmail.com> (https://www.guillaume-martigny.fr)";

/**
 * Homepage of the library
 */
export const homepage = "https://pencil.js.org/";

let isRegistered = false;

/**
 * Construct Pencil.js objects (and their children) from a JSON definition
 * @param json - Valid JSON definition (from any `toJSON` call)
 * @example
 * const copy = from(JSON.parse(JSON.stringify(scene)));
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function from<T = any> (json: Definition): T {
    // Registering lazily keep everything tree-shakable when "from" is not used
    if (!isRegistered) {
        register(
            Container,
            Particles,
            OffScreenCanvas,
            Scene,
            Arc,
            Pie,
            Ellipse,
            Circle,
            Line,
            Spline,
            Polygon,
            RegularPolygon,
            Triangle,
            Star,
            Rectangle,
            Square,
            Image,
            Text,
            Path,
            Select,
            Slider,
            Checkbox,
            Button,
            ProgressBar,
            ProgressPie,
            Knob,
            LinearGradient,
            RadialGradient,
            ConicGradient,
            Pattern,
            Heart,
            Sprite,
        );
        isRegistered = true;
    }
    return revive<T>(json);
}

/**
 * Plugin for Pencil.js
 */
export interface Plugin {
    /** Name of the plugin */
    name: string;
    /** Function called at use */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    install: (pencil: typeof Pencil, options?: any) => void;
}

const installed: Array<string> = [];

/**
 * Install a plugin in Pencil.js
 * @param plugin - Plugin to install
 * @param options - Option passed down to the plugin
 * @returns The Pencil.js package
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function use ({ name, install }: Plugin, options?: any): typeof Pencil {
    if (!name) {
        throw new Error("You're trying to install a nameless plugin.");
    }
    if (installed.includes(name)) {
        throw new Error(`The plugin "${name}" is already installed.`);
    }


    install(Pencil, options);
    installed.push(name);


    return Pencil;
}

/**
 * Everything under one namespace
 */
const Pencil = {
    EventEmitter,
    Container,
    Scene,
    Component,
    Particles,
    Arc,
    Pie,
    Ellipse,
    Circle,
    Line,
    Spline,
    Polygon,
    RegularPolygon,
    Triangle,
    Star,
    Rectangle,
    Square,
    Image,
    Text,
    Path,
    Instruction,
    Heart,
    Sprite,
    Spritesheet,
    Math,
    Navigation,
    Position,
    Vector,
    BaseEvent,
    MouseEvent,
    NetworkEvent,
    KeyboardEvent,
    Widget,
    Input,
    Slider,
    Checkbox,
    Button,
    OffScreenCanvas,
    Select,
    ProgressBar,
    ProgressPie,
    Knob,
    Color,
    LinearGradient,
    RadialGradient,
    ConicGradient,
    Pattern,
    from,
    register,
    use,
    version,
    author,
    homepage,
};

export default Pencil;

export {
    EventEmitter,
    Container,
    Scene,
    Component,
    Particles,
    Arc,
    Pie,
    Ellipse,
    Circle,
    Line,
    Spline,
    Polygon,
    RegularPolygon,
    Triangle,
    Star,
    Rectangle,
    Square,
    Image,
    Text,
    Path,
    Instruction,
    Heart,
    Sprite,
    Spritesheet,
    Math,
    Navigation,
    Position,
    Vector,
    BaseEvent,
    MouseEvent,
    NetworkEvent,
    KeyboardEvent,
    Widget,
    Input,
    Slider,
    Checkbox,
    Button,
    OffScreenCanvas,
    Select,
    ProgressBar,
    ProgressPie,
    Knob,
    Color,
    LinearGradient,
    RadialGradient,
    ConicGradient,
    Pattern,
    register,
};

// Types
export type { PositionDefinition, AbstractPosition } from "./position.js";
export type { VectorDefinition, AbstractVector } from "./vector.js";
export type { ColorDefinition } from "./color.js";
export type { ContainerOptions, ContainerJSON } from "./container.js";
export type { ComponentOptions, ShadowOptions, Style } from "./component.js";
export type { OffScreenCanvasOptions } from "./offscreen-canvas.js";
export type { SceneOptions } from "./scene.js";
export type { LineOptions } from "./line.js";
export type { RectangleOptions } from "./rectangle.js";
export type { ImageOptions, ImageSource } from "./image.js";
export type { TextOptions, TextMeasures } from "./text.js";
export type { SpriteOptions, FrameData, SpritesheetData, FrameSelector } from "./sprite.js";
export type { InstructionCallback, InstructionJSON } from "./path.js";
export type { ParticleData, ParticlesOptions, OptionsGenerator, ParticlesCallback } from "./particles.js";
export type { PatternOptions, PatternRepetition, PatternSource } from "./pattern.js";
export type { WidgetOptions, WidgetBase } from "./widget.js";
export type { InputOptions } from "./input.js";
export type { ButtonOptions } from "./button.js";
export type { CheckboxOptions } from "./checkbox.js";
export type { SelectOptions } from "./select.js";
export type { SliderOptions } from "./slider.js";
export type { ProgressBarOptions } from "./progress-bar.js";
export type { ProgressPieOptions } from "./progress-pie.js";
export type { KnobOptions } from "./knob.js";
export type { DraggableOptions, DraggableAPI } from "./draggable.js";
export type { ResizableOptions } from "./resizable.js";
export type { RotatableAPI } from "./rotatable.js";
export type { EventCallback, EventListener } from "./event-emitter.js";
export type { Revivable, Definition } from "./serialization.js";
