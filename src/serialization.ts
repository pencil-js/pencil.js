/**
 * Turn JSON definitions back into Pencil.js instances
 */

/**
 * Any class able to revive itself from a JSON definition
 */
export interface Revivable {
    className?: string;
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    from (definition: any): unknown;
}

/**
 * Any JSON definition produced by a Pencil.js `toJSON`
 */
export interface Definition {
    constructor: string;
    children?: Array<Definition>;
    options?: Record<string, unknown>;
    [key: string]: unknown;
}

const registry = new Map<string, Revivable>();

/**
 * Make classes available to the {@link from} function
 * (every built-in class is registered when importing the main "pencil.js" entry)
 * @param classes - Any set of classes
 * @example
 * class MyShape extends Component { … }
 * register(MyShape);
 */
export function register (...classes: Array<Revivable>): void {
    for (const one of classes) {
        registry.set(Object.hasOwn(one, "className") && one.className ? one.className : one.name, one);
    }
}

const isDefinition = (value: unknown): value is Definition => Boolean(value) && typeof value === "object" &&
    !Array.isArray(value) && typeof (value as Definition).constructor === "string";

/**
 * Construct Pencil.js objects (and their children) from a JSON definition
 * @param json - Valid JSON definition (from any `toJSON` call)
 * @example
 * const copy = from(JSON.parse(JSON.stringify(scene)));
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function from<T = any> (json: Definition): T {
    const Class = registry.get(json.constructor);
    if (!Class) {
        throw new ReferenceError(`Unknown class "${json.constructor}", make sure it's registered (see "register").`);
    }

    // Revive nested definitions in options (fill, stroke, clip …)
    let { options } = json;
    if (options) {
        options = Object.fromEntries(Object.entries(options).map(([key, value]) => [key, isDefinition(value) ? from(value) : value]));
    }

    const instance = Class.from({
        ...json,
        options,
    }) as T & { add?: (...children: Array<unknown>) => unknown };
    if (json.children?.length && instance.add) {
        instance.add(...json.children.map(child => from(child)));
    }
    return instance;
}
