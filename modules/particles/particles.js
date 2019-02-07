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
     * @return ParticleOptions
     */
    /**
     * Particles constructor
     * @param {PositionDefinition} positionDefinition - Origin for all particles
     * @param {Component} base - Blueprint for each particle
     * @param {Number} nbInstances - Number of particle to create
     * @param {OptionsGenerator} optionGenerator -
     */
    constructor (positionDefinition, base, nbInstances, optionGenerator) {
        super(positionDefinition, base.options);
        this.base = base;
        this.data = [...new Array(nbInstances)].map((_, index) => {
            const data = {
                ...Particles.defaultOptions,
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
        this.data.forEach((data) => {
            const { scale, position, rotation } = data;
            const rotationRadian = rotation * radianCircle;
            matrix.a = Math.cos(rotationRadian) * scale.x;
            matrix.b = Math.sin(rotationRadian) * scale.x;
            matrix.c = -Math.sin(rotationRadian) * scale.y;
            matrix.d = Math.cos(rotationRadian) * scale.y;
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

    static from (definition) {
        const base = from(definition.base);
        const particles = new Particles(definition.position, base, 0);
        particles.data = definition.data;
        return particles;
    }

    /**
     * @typedef {Object} ParticleOptions
     * @prop {Position} [position=[0, 0] - Position of the particle
     * @prop {Number} [rotation=0] - Rotation of the particle
     * @prop {Position} [scale=[1, 1] - Scale of the particle
     */
    /**
     * @return {ParticleOptions}
     */
    static get defaultOptions () {
        return {
            position: new Position(),
            rotation: 0,
            scale: new Position(1, 1),
        };
    }
}
