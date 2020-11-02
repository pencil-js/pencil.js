import Component from "@pencil.js/component";
import Position from "@pencil.js/position";
import { radianCircle } from "@pencil.js/math";

/**
 * @module Particles
 */

/**
 * Particles generator class
 * @class
 * @extends Component
 */
export default class Particles extends Component {
    /**
     * @callback OptionsGenerator
     * @param {Number} index - Index of the particle
     * @return ParticleData
     */
    /**
     * @callback ParticlesCallback
     * @param {ParticleData} data - One particle data
     * @param {Number} index - Index of the particle
     */
    /**
     * Particles constructor
     * @param {PositionDefinition} positionDefinition - Origin for all particles
     * @param {Component} base - Blueprint for each particle
     * @param {Number} nbInstances - Number of particle to create
     * @param {OptionsGenerator} optionGenerator - Initialization function for all particles data
     * @param {ParticlesCallback} updater - Function called on each particle draw (should not be computation intensive)
     */
    constructor (positionDefinition, base, nbInstances, optionGenerator, updater) {
        super(positionDefinition, base.options);
        this.base = base;
        this.updater = updater;
        this.data = [...new Array(nbInstances)].map((_, index) => {
            const data = {
                ...Particles.defaultData,
                ...optionGenerator(index),
            };
            data.position = Position.from(data.position);
            return data;
        });
    }

    /**
     * @inheritDoc
     */
    trace (path) {
        const basePath = new window.Path2D();
        this.base.trace(basePath);
        const matrix = new window.DOMMatrix();
        const { cos, sin } = Math;
        this.data.forEach((data, index) => {
            if (this.updater) {
                this.updater(data, index);
            }
            const { position, scale = 1, rotation = 0 } = data;
            const scaleOptions = typeof scale === "number" ? [scale, scale] : Position.from(scale).toJSON();
            const rotationRadian = rotation * radianCircle;
            matrix.a = cos(rotationRadian) * scaleOptions[0];
            matrix.b = sin(rotationRadian) * scaleOptions[0];
            matrix.c = -sin(rotationRadian) * scaleOptions[1];
            matrix.d = cos(rotationRadian) * scaleOptions[1];
            matrix.e = position.x;
            matrix.f = position.y;
            path.addPath(basePath, matrix);
        });
        return this;
    }

    /**
     * @inheritDoc
     */
    isHover () { // eslint-disable-line class-methods-use-this
        return false;
    }

    /**
     * @inheritDoc
     */
    toJSON () {
        const { base, data } = this;
        return {
            ...super.toJSON(),
            base,
            data,
        };
    }

    /**
     * @inheritDoc
     * @param {Object} definition -
     * @return {Particles}
     */
    static from (definition) {
        // FIXME
        const base = from(definition.base);
        const particles = new Particles(definition.position, base, 0);
        particles.data = definition.data;
        return particles;
    }

    /**
     * @typedef {Object} ParticleData
     * @prop {Position} [position=new Position()] - Position of the particle
     * @prop {Number} [rotation=0] - Rotation of the particle
     * @prop {Number|Position} [scale=1] - Scaling ratio or a pair of value for horizontal and vertical scaling
     */
    /**
     * @type {ParticleData}
     */
    static get defaultData () {
        return {
            position: new Position(),
        };
    }
}
