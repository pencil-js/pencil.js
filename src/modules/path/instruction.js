import Position from "@pencil.js/position";

/**
 * @module Instruction
 */

/**
 * Instruction class
 * @class
 */
export default class Instruction {
    /**
     * @callback InstructionCallback
     * @param {CanvasRenderingContext2D} ctx
     * @param {Position} target
     * @param {Position} previousPosition
     */
    /**
     * Instruction constructor
     * @param {InstructionCallback} action - Function to execute
     * @param {PositionDefinition} target - Position to go to
     */
    constructor (action, target) {
        this.action = action;
        this.target = Position.from(target);
    }

    /**
     * Follow the instruction
     * @param {Path2D} path - Current drawing path
     * @param {Position} previousPosition - Position from where the instruction start
     * @return {Position} The position reached
     */
    execute (path, previousPosition) {
        this.action.call(this, path, this.target, previousPosition);
        return this.target;
    }

    /**
     * Unimplemented
     * FIXME: How to serialize a wrapper of a function ?
     */
    toJSON () { // eslint-disable-line class-methods-use-this
        throw new ReferenceError("Unimplemented toJSON function in Path's Instruction");
    }

    /**
     * Unimplemented
     * FIXME
     */
    static from () {
        throw new ReferenceError("Unimplemented from function in Instruction");
    }
}
