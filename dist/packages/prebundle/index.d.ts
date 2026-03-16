/**
 * Pre-bundle module — provides infrastructure for embedding npm packages
 * at build time so they load instantly at runtime without registry fetches.
 */
export { PrebundleStore, satisfiesRange } from "./store";
export type { PrebundleData, PrebundledPackage, PrebundleFile, PrebundleManifest, PrebundleManifestEntry, } from "./types";
