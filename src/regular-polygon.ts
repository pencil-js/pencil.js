import Polygon from "./polygon.js";
import type { ComponentOptions } from "./component.js";
import type { ContainerJSON } from "./container.js";
import Position, { type PositionDefinition } from "./position.js";
import { radianCircle } from "./math.js";

/**
 * Polygon with all sides of the same length
 * @module RegularPolygon
 */
export default class RegularPolygon<O extends ComponentOptions = ComponentOptions> extends Polygon<O> {
    static override get className (): string {
        return "RegularPolygon";
    }

    #radius: number;

    /**
     * Regular polygon constructor
     * @param positionDefinition - Center of the polygon
     * @param nbSides - Number of sides
     * @param radius - Distance between center and outer points
     * @param options - Drawing options
     */
    constructor (positionDefinition: PositionDefinition | undefined, nbSides: number, radius = 0, options?: Partial<O>) {
        super(positionDefinition, RegularPolygon.getRotatingPoints(nbSides, radius), options);

        this.#radius = radius;
    }

    /**
     * Distance between center and outer points
     */
    get radius (): number {
        return this.#radius;
    }

    set radius (radius: number) {
        const newPoints = RegularPolygon.getRotatingPoints(this.points.length, radius);
        this.points.forEach((point, index) => point.set(newPoints[index]));
        this.#radius = radius;
    }

    /**
     * Number of sides
     */
    get nbSides (): number {
        return this.points.length;
    }

    set nbSides (nbSides: number) {
        this.points = RegularPolygon.getRotatingPoints(nbSides, this.#radius);
    }

    override toJSON (): ContainerJSON {
        const { points: _points, ...json } = super.toJSON();
        return {
            ...json,
            nbSides: this.nbSides,
            radius: this.radius,
        };
    }

    /**
     * Return an instance from a generic object
     * @param definition - RegularPolygon definition
     */
    static override from (definition: ContainerJSON): RegularPolygon {
        return new this(definition.position, definition.nbSides, definition.radius, definition.options);
    }

    /**
     * Return positions at regular intervals around a circle
     * @param nbPoints - Number of points
     * @param radius - Distance from origin
     * @param startAngle - Starting angle (in ratio of full circle, 0 is up)
     * @param center - Center of the circle
     */
    static getRotatingPoints (nbPoints: number, radius: number, startAngle = 0, center?: PositionDefinition): Array<Position> {
        const angle = startAngle - 0.25;
        const shift = Position.from(center);
        return Array.from({ length: nbPoints }, (_, i) => {
            const rotation = ((i / nbPoints) + angle) * radianCircle;
            return new Position(Math.cos(rotation) * radius, Math.sin(rotation) * radius).add(shift);
        });
    }
}
