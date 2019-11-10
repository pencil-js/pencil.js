// Basics
import Position from "@pencil.js/position";
import Vector from "@pencil.js/vector";
import * as Math from "@pencil.js/math";
import OffScreenCanvas from "@pencil.js/offscreen-canvas";
import Color from "@pencil.js/color";
import LinearGradient from "@pencil.js/linear-gradient";
import RadialGradient from "@pencil.js/radial-gradient";
import * as Navigation from "@pencil.js/navigation";

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
import Particles from "@pencil.js/particles";

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
import Heart from "@pencil.js/heart";
import Sprite from "@pencil.js/sprite";

// Complex
import Input from "@pencil.js/input";
import Button from "@pencil.js/button";
import Checkbox from "@pencil.js/checkbox";
import Select from "@pencil.js/select";
import Slider from "@pencil.js/slider";
import ProgressBar from "@pencil.js/progress-bar";
import ProgressPie from "@pencil.js/progress-pie";
import Knob from "@pencil.js/knob";

// Interactions
import "@pencil.js/draggable";
import "@pencil.js/resizable";
import "@pencil.js/rotatable";

// Package data
import { version, author, homepage } from "./package.json";

const exportableClasses = {
    Container,
    Particles,
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
    ProgressBar,
    ProgressPie,
    Knob,
    Color,
    LinearGradient,
    RadialGradient,
    Heart,
    Sprite,
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
export default {
    EventEmitter,
    Component,
    Input,
    BaseEvent,
    MouseEvent,
    NetworkEvent,
    KeyboardEvent,
    from,
    Math,
    Navigation,
    OffScreenCanvas,
    version,
    author,
    homepage,
    ...exportableClasses,
};

// Named exports
export {
    EventEmitter,
    Container,
    Scene,
    Component,
    Particles,
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
    Navigation,
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
    ProgressBar,
    ProgressPie,
    Knob,
    from,
    version,
    author,
    homepage,
    Color,
    LinearGradient,
    RadialGradient,
    Heart,
    Sprite,
};
