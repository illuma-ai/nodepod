/**
 * Pre-bundle types — defines the shape of pre-bundled package data
 * that can be embedded at build time for instant loading at runtime.
 */

/**
 * A single file within a pre-bundled package.
 * Content is stored as base64-encoded string for JSON serialization.
 */
export interface PrebundleFile {
  /** Relative path within the package (e.g., "index.js", "lib/utils.js") */
  path: string;
  /** Base64-encoded file content (already CJS-transformed) */
  content: string;
}

/**
 * A fully resolved, pre-bundled package ready to write to the VFS.
 * All modules are already CJS-transformed — no registry fetch or
 * build step needed at runtime.
 */
export interface PrebundledPackage {
  /** Package name (e.g., "express", "@types/node") */
  name: string;
  /** Exact resolved version (e.g., "4.18.2") */
  version: string;
  /** All files in the package, already transformed */
  files: PrebundleFile[];
  /** Direct dependencies (name -> version range) from package.json */
  dependencies: Record<string, string>;
}

/**
 * A collection of pre-bundled packages that can be loaded together.
 * Typically represents a "bundle set" like "web-fullstack" or "api-starter".
 */
export interface PrebundleData {
  /** Human-readable name for this bundle set */
  name: string;
  /** semver version of the bundle data itself */
  version: string;
  /** When this bundle was generated (ISO 8601) */
  generatedAt: string;
  /** All packages in this bundle, keyed by package name */
  packages: Record<string, PrebundledPackage>;
}

/**
 * Entry in the prebundle manifest — specifies what to prebundle.
 * Used by the build-time generation script.
 */
export interface PrebundleManifestEntry {
  /** npm package name */
  name: string;
  /** semver range to resolve (e.g., "^4.18.0") */
  version: string;
}

/**
 * Build-time manifest that declares which packages to prebundle.
 */
export interface PrebundleManifest {
  /** Bundle set name */
  name: string;
  /** Packages to include */
  packages: PrebundleManifestEntry[];
}
