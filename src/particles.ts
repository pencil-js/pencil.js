import Component, { type ComponentOptions } from "./component.js";
import type { ContainerJSON } from "./container.js";
import Position, { type PositionDefinition } from "./position.js";
import { radianCircle, random } from "./math.js";
import { from } from "./serialization.js";

/**
 * Data of one particle
 */
export interface ParticleData {
    /** Position of the particle */
    position: Position;
    /** Rotation applied to the particle */
    rotation?: number;
    /** Scaling ratio or a pair of value for horizontal and vertical scaling */
    scale?: number | PositionDefinition;
    /** Time to live, number of frames the particle is displayed. This number will be decremented and the data removed when it reach 0 */
    ttl?: number;
    [key: string]: unknown;
}

/**
 * Initialization function for particles data
 */
export type OptionsGenerator = (index: number, ...params: Array<unknown>) => Partial<Omit<ParticleData, "position">> & { position?: PositionDefinition };

/**
 * Function called on each particle at each draw
 */
export type ParticlesCallback = (data: ParticleData, index: number, ...params: Array<unknown>) => void;

/**
 * Particles options
 */
export interface ParticlesOptions extends ComponentOptions {
    /** Probability of emission at each frame (between 0 and 1) */
    frequency: number;
    /** Number (or range) of particles emitted */
    emit: number | [number, number] | null;
    /** Arguments passed to the generator function */
    args: Array<unknown>;
}

/**
 * Efficiently draw lots of copies of the same shape
 */
export class Particles<O extends ParticlesOptions = ParticlesOptions> extends Component<O> {
    static override get className (): string {
        return "Particles";
    }

    /** Blueprint for each particle */
    base: Component;

    /** Initialization function for all particles data */
    generator?: OptionsGenerator;

    /** Function called on each particle draw */
    updater?: ParticlesCallback;

    /** All particles data */
    data: Array<ParticleData>;

    /**
     * Particles constructor
     * @param positionDefinition - Origin for all particles
     * @param base - Blueprint for each particle
     * @param generator - Initialization function for all particles data
     * @param updater - Function called on each particle draw (should not be computation intensive)
     * @param options - Specific options
     */
    constructor (
        positionDefinition: PositionDefinition | undefined,
        base: Component,
        generator?: OptionsGenerator,
        updater?: ParticlesCallback,
        options?: Partial<O>,
    ) {
        super(positionDefinition, {
            ...base.options,
            ...options,
        } as unknown as Partial<O>);
        this.base = base;
        this.generator = generator;
        this.updater = updater;
        this.data = [];
    }

    /**
     * Create new particles
     * @param number - Number of particles to generate
     * @param params - Additional parameters for the generator function
     * @returns Itself
     */
    generate (number: number, ...params: Array<unknown>): this {
        for (let index = 0; index < number; ++index) {
            const generated = this.generator ? this.generator(index, ...params) : {};
            this.data.push({
                ...Particles.defaultData,
                ...generated,
                position: Position.from(generated.position),
            });
        }

        return this;
    }

    /**
     * Update every particle (called once per render)
     * @returns Itself
     */
    update (): this {
        this.data = this.data.filter((data, index) => {
            this.updater?.(data, index);
            if (data.ttl === undefined) {
                return true;
            }
            data.ttl--;
            return data.ttl > 0;
        });

        const { emit, frequency, args } = this.options;
        if (emit && random() < frequency) {
            const nb = Array.isArray(emit) ? random(...emit) : emit;
            this.generate(Math.floor(nb), ...args);
        }

        return this;
    }

    override makePath (ctx: CanvasRenderingContext2D): this {
        this.update();
        return super.makePath(ctx);
    }

    /**
     * Draw all particles
     * @param path - Drawing path
     * @returns Itself
     */
    trace (path: Path2D): this {
        const basePath = new Path2D();
        this.base.trace(basePath);
        const baseOrigin = this.base.getOrigin();
        const matrix = new DOMMatrix();
        for (const data of this.data) {
            const { position, scale = 1, rotation = 0 } = data;
            const { x: scaleX, y: scaleY } = typeof scale === "number" ? { x: scale, y: scale } : Position.from(scale);
            const radian = rotation * radianCircle;
            const cos = Math.cos(radian);
            const sin = Math.sin(radian);
            matrix.a = cos * scaleX;
            matrix.b = sin * scaleX;
            matrix.c = -sin * scaleY;
            matrix.d = cos * scaleY;
            matrix.e = position.x + (matrix.a * baseOrigin.x) + (matrix.c * baseOrigin.y);
            matrix.f = position.y + (matrix.b * baseOrigin.x) + (matrix.d * baseOrigin.y);
            path.addPath(basePath, matrix);
        }

        return this;
    }

    /**
     * Particles can't be hovered
     */
    override isHover (): boolean {
        return false;
    }

    override toJSON (): ContainerJSON {
        const { base, data } = this;
        return {
            ...super.toJSON(),
            base: base.toJSON(),
            data: data.map(one => ({
                ...one,
                position: one.position.toJSON(),
            })),
        };
    }

    /**
     * Return an instance from a generic object (needs the base class to be registered)
     * @param definition - Particles definition
     */
    static override from (definition: ContainerJSON): Particles {
        const base = from<Component>(definition.base);
        const particles = new this(definition.position, base, undefined, undefined, definition.options);
        particles.data = (definition.data ?? []).map((one: ParticleData) => ({
            ...one,
            position: Position.from(one.position),
        }));
        return particles;
    }

    /**
     * Default data for every particle
     */
    static get defaultData (): ParticleData {
        return {
            position: new Position(),
        };
    }

    static override get defaultOptions (): ParticlesOptions {
        return {
            ...super.defaultOptions,
            frequency: 1,
            emit: null,
            args: [],
        };
    }
}

export default Particles;
