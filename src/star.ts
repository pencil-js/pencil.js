import RegularPolygon from "./regular-polygon.js";
import type { ComponentOptions } from "./component.js";
import type { ContainerJSON } from "./container.js";
import type { PositionDefinition } from "./position.js";

/**
 * Star shape
 */
export class Star<O extends ComponentOptions = ComponentOptions> extends RegularPolygon<O> {
    static override get className (): string {
        return "Star";
    }

    #bevelRatio: number;

    /**
     * Star constructor
     * @param positionDefinition - Center of the star
     * @param nbBranches - Number of branches
     * @param radius - Distance from center to outer points
     * @param bevelRatio - Ratio of the inner radius relative to the outer radius
     * @param options - Drawing options
     */
    constructor (positionDefinition?: PositionDefinition, nbBranches = 5, radius = 0, bevelRatio = 0.5, options?: Partial<O>) {
        super(positionDefinition, nbBranches * 2, radius, options);

        this.#bevelRatio = bevelRatio;
        this.rebuild();
    }

    /**
     * Number of branches
     */
    get nbBranches (): number {
        return this.points.length / 2;
    }

    set nbBranches (nbBranches: number) {
        this.points = RegularPolygon.getRotatingPoints(nbBranches * 2, this.radius);
        this.rebuild();
    }

    override get radius (): number {
        return super.radius;
    }

    override set radius (radius: number) {
        super.radius = radius;
        this.rebuild();
    }

    override get nbSides (): number {
        return super.nbSides;
    }

    override set nbSides (nbSides: number) {
        this.nbBranches = nbSides / 2;
    }

    /**
     * Ratio of the inner radius relative to the outer radius
     */
    get bevelRatio (): number {
        return this.#bevelRatio;
    }

    set bevelRatio (bevelRatio: number) {
        this.#bevelRatio = bevelRatio;
        this.rebuild();
    }

    /**
     * Compute the inner points position
     * @returns Itself
     */
    rebuild (): this {
        const innerRadius = this.radius * this.#bevelRatio;
        const innerPoints = RegularPolygon.getRotatingPoints(this.nbBranches, innerRadius, 0.5 / this.nbBranches);
        this.points.forEach((point, index) => {
            if (index % 2) {
                point.set(innerPoints[(index - 1) / 2]);
            }
        });
        return this;
    }

    override toJSON (): ContainerJSON {
        const { nbSides, ...json } = super.toJSON();
        return {
            ...json,
            nbBranches: nbSides / 2,
            bevelRatio: this.bevelRatio,
        };
    }

    /**
     * Return an instance from a generic object
     * @param definition - Star definition
     */
    static override from (definition: ContainerJSON): Star {
        return new this(definition.position, definition.nbBranches, definition.radius, definition.bevelRatio, definition.options);
    }
}

export default Star;
