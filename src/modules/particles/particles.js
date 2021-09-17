import Component from "@pencil.js/component";
import Position from "@pencil.js/position";
import { radianCircle, random } from "@pencil.js/math";

/**
 * @module Particles
 */

/**
 * Particles generator class
 * <br><img src="./media/examples/particles.png" alt="particles demo"/>
 * @class
 * @extends {module:Component}
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
     * @param {...*} params - Additional parameters
     */
    /**
     * Particles constructor
     * @param {PositionDefinition} positionDefinition - Origin for all particles
     * @param {Component} base - Blueprint for each particle
     * @param {OptionsGenerator} [generator] - Initialization function for all particles data
     * @param {ParticlesCallback} [updater] - Function called on each particle draw (should not be computation intensive)
     * @param {ParticleOptions} [options] -
     */
    constructor (positionDefinition, base, generator, updater, options) {
        super(positionDefinition, {
            ...base.options,
            ...options,
        });
        this.base = base;
        this.generator = generator;
        this.updater = updater;
        this.data = [];
    }

    /**
     * Create new particles
     * @param {Number} number - Number of particles to generate
     * @param {...*} params - Additional parameters for the generator function
     * @return {Particles} Itself
     */
    generate (number, ...params) {
        this.data = this.data.concat([...new Array(number)].map((_, index) => {
            const data = {
                ...Particles.defaultData,
                ...this.generator ? this.generator(index, ...params) : {},
            };
            data.position = Position.from(data.position);
            return data;
        }));

        return this;
    }

    /**
     * @inheritDoc
     */
    trace (path) {
        const basePath = new window.Path2D();
        this.base.trace(basePath);
        const matrix = new window.DOMMatrix();
        const { cos, sin } = Math;
        this.data = this.data.filter((data, index) => {
            if (this.updater) {
                this.updater(data, index);
            }
            const { position, scale = 1, rotation = 0, ttl } = data;
            const scaleOptions = typeof scale === "number" ? [scale, scale] : Position.from(scale).toJSON();
            const rotationRadian = rotation * radianCircle;
            matrix.a = cos(rotationRadian) * scaleOptions[0];
            matrix.b = sin(rotationRadian) * scaleOptions[0];
            matrix.c = -sin(rotationRadian) * scaleOptions[1];
            matrix.d = cos(rotationRadian) * scaleOptions[1];
            matrix.e = position.x;
            matrix.f = position.y;
            path.addPath(basePath, matrix);

            return !ttl || --data.ttl > 0;
        });

        if (this.options.emit && random() < this.options.frequency) {
            const nb = Array.isArray(this.options.emit) ? random(...this.options.emit) : this.options.emit;
            this.generate(Math.floor(nb), ...this.options.args);
        }

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
     * @param {Object} definition - Particles definition
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
     * @typedef {Object} ParticleOptions
     * @extends ComponentOptions
     * @prop {Number} [frequency=1] - Frequency of emission (randomized)
     * @prop {Number|Array<Number>} [emit] - Number or range of particles emitted
     * @prop {Array} [args] - Arguments passed to the generator function
     */
    /**
     * @type {ParticleOptions}
     */
    static get defaultOptions () {
        return {
            ...super.defaultOptions,
            frequency: 1,
            emit: null,
            args: [],
        };
    }

    /**
     * @typedef {Object} ParticleData
     * @prop {Position} [position=new Position()] - Position of the particle
     * @prop {Number} [rotation=0] - Rotation applied to the particle
     * @prop {Number|Position} [scale=1] - Scaling ratio or a pair of value for horizontal and vertical scaling
     * @prop {Number} [ttl] - Time to live, number of frames the particle is displayed. This number will be decremented and the data removed when it reach 0
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
