// Basics
import Position from "@pencil.js/position";
import Vector from "@pencil.js/vector";
import * as Math from "@pencil.js/math";
import OffScreenCanvas from "@pencil.js/offscreen-canvas";
import Color from "@pencil.js/color";

// Events
import BaseEvent from "@pencil.js/base-event";
import MouseEvent from "@pencil.js/mouse-event";
import NetworkEvent from "@pencil.js/network-event";
import KeyboardEvent from "@pencil.js/keyboard-event";

// Trunk
import EventEmitter from "@pencil.js/event-emitter";
import Container from "@pencil.js/container";
import Scene from "@pencil.js/scene";
import Component from "@pencil.js/component";

// Shapes
import Arc from "@pencil.js/arc";
import Ellipse from "@pencil.js/ellipse";
import Circle from "@pencil.js/circle";
import Line from "@pencil.js/line";
import Spline from "@pencil.js/spline";
import Polygon from "@pencil.js/polygon";
import RegularPolygon from "@pencil.js/regular-polygon";
import Triangle from "@pencil.js/triangle";
import Star from "@pencil.js/star";
import Rectangle from "@pencil.js/rectangle";
import Square from "@pencil.js/square";
import Image from "@pencil.js/image";
import Text from "@pencil.js/text";
import Path from "@pencil.js/path";

// Complex
import Input from "@pencil.js/input";
import Button from "@pencil.js/button";
import Checkbox from "@pencil.js/checkbox";
import Select from "@pencil.js/select";
import Slider from "@pencil.js/slider";
import ProgressBar from "@pencil.js/progress-bar";

// Interactions
import "@pencil.js/draggable";
import "@pencil.js/resizable";

// Package data
import { version, author, homepage } from "./package.json";

const exportableClasses = {
    Container,
    Scene,
    Arc,
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
    Position,
    Vector,
    Select,
    Slider,
    Checkbox,
    Button,
    Color,
    ProgressBar,
};

/**
 * Construct Pencil objects from a JSON
 * @param {Object} json - Valid JSON
 * @return {*}
 */
function from (json) {
    const instance = exportableClasses[json.constructor].from(json);
    if (json.children) {
        instance.add(...json.children.map(child => from(child)));
    }
    return instance;
}

// Export all under namespace
export default Object.assign({
    EventEmitter,
    Component,
    Input,
    BaseEvent,
    MouseEvent,
    NetworkEvent,
    KeyboardEvent,
    default: undefined,
    from,
    Math,
    OffScreenCanvas,
    version,
    author,
    homepage,
}, exportableClasses);

// Named exports
export {
    EventEmitter,
    Container,
    Scene,
    Component,
    Arc,
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
    Math,
    Position,
    Vector,
    BaseEvent,
    MouseEvent,
    NetworkEvent,
    KeyboardEvent,
    Input,
    Slider,
    Checkbox,
    Button,
    OffScreenCanvas,
    Select,
    from,
    version,
    author,
    homepage,
    Color,
    ProgressBar,
};
