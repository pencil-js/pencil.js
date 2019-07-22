import Component from "@pencil.js/component";
import Position from "@pencil.js/position";
import { radianCircle } from "@pencil.js/math";

/**
 * Particles generator class
 * @class
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
            data.scale = Position.from(data.scale);
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
            const { scale, position, rotation } = data;
            const rotationRadian = rotation * radianCircle;
            matrix.a = cos(rotationRadian) * scale.x;
            matrix.b = sin(rotationRadian) * scale.x;
            matrix.c = -sin(rotationRadian) * scale.y;
            matrix.d = cos(rotationRadian) * scale.y;
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
     * @returns {Particles}
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
     * @prop {Position} [position=[0, 0]] - Position of the particle
     * @prop {Number} [rotation=0] - Rotation of the particle
     * @prop {Position} [scale=[1, 1] - Scale of the particle
     */
    /**
     * @return {ParticleData}
     */
    static get defaultData () {
        return {
            position: new Position(),
            rotation: 0,
            scale: new Position(1, 1),
        };
    }
}
