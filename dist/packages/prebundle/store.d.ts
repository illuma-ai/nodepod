/**
 * PrebundleStore — runtime store for pre-bundled packages.
 *
 * Provides a fast lookup layer that the DependencyInstaller checks
 * before hitting the npm registry. Pre-bundled packages are written
 * directly to the VFS, skipping download + transform entirely.
 */
import type { MemoryVolume } from "../../memory-volume";
import type { PrebundleData, PrebundledPackage } from "./types";
/**
 * Checks whether `actual` satisfies `range`.
 * Supports: exact match, "*", "latest", "^major.minor.patch", "~major.minor.patch".
 * This is intentionally minimal — covers 95%+ of real-world ranges without
 * pulling in a full semver library.
 */
export declare function satisfiesRange(actual: string, range: string): boolean;
export declare class PrebundleStore {
    private _bundles;
    /** Flattened index: packageName -> PrebundledPackage (last-registered wins) */
    private _index;
    /**
     * Load prebundle data from a URL (static JSON asset).
     * Returns a PrebundleStore with the data already registered.
     */
    static loadFromUrl(url: string): Promise<PrebundleStore>;
    /**
     * Create a PrebundleStore from inline PrebundleData (for bundled usage).
     */
    static fromData(...bundles: PrebundleData[]): PrebundleStore;
    /**
     * Register one or more pre-bundle data sets.
     * Call this before the first `install()` / `installFromManifest()`.
     */
    addBundle(bundle: PrebundleData): void;
    /** Check if a package is available in the prebundle store. */
    has(name: string, versionRange?: string): boolean;
    /** Get a pre-bundled package by name. */
    get(name: string): PrebundledPackage | null;
    /** List all available pre-bundled package names. */
    list(): string[];
    /** Number of pre-bundled packages available. */
    get size(): number;
    /**
     * Write a pre-bundled package directly to the VFS.
     * Creates the node_modules/<name>/ directory and writes all files.
     *
     * @returns Number of files written
     */
    materialize(name: string, vol: MemoryVolume, nmRoot?: string): number;
    /**
     * Materialize a package and all its transitive dependencies that are
     * also in the prebundle store. Returns list of materialized package names.
     */
    materializeWithDeps(name: string, vol: MemoryVolume, nmRoot?: string): string[];
}
