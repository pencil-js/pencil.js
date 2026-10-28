/** Replaced at build time by the package version */
declare const __PENCIL_VERSION__: string;

declare module "text-direction" {
    /**
     * Return the text direction ("ltr" or "rtl") of a node
     */
    export default function textDirection (elementNode?: Element): "ltr" | "rtl" | "";
}
