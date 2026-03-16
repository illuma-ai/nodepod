/**
 * PrebundleStore — runtime store for pre-bundled packages.
 *
 * Provides a fast lookup layer that the DependencyInstaller checks
 * before hitting the npm registry. Pre-bundled packages are written
 * directly to the VFS, skipping download + transform entirely.
 */

import type { MemoryVolume } from "../../memory-volume";
import type { PrebundleData, PrebundledPackage } from "./types";
import { base64ToBytes } from "../../helpers/byte-encoding";
import * as path from "../../polyfills/path";

/**
 * Checks whether `actual` satisfies `range`.
 * Supports: exact match, "*", "latest", "^major.minor.patch", "~major.minor.patch".
 * This is intentionally minimal — covers 95%+ of real-world ranges without
 * pulling in a full semver library.
 */
export function satisfiesRange(actual: string, range: string): boolean {
  if (range === "*" || range === "latest" || range === actual) return true;

  const parseVersion = (v: string): [number, number, number] | null => {
    const cleaned = v.replace(/^[~^>=<]+/, "");
    const parts = cleaned.split(".").map(Number);
    if (parts.length < 3 || parts.some(isNaN)) return null;
    return [parts[0], parts[1], parts[2]];
  };

  const actualParts = parseVersion(actual);
  const rangeParts = parseVersion(range);
  if (!actualParts || !rangeParts) return false;

  const [aMaj, aMin, aPatch] = actualParts;
  const [rMaj, rMin, rPatch] = rangeParts;

  if (range.startsWith("^")) {
    // ^1.2.3 allows >=1.2.3 <2.0.0 (same major)
    if (rMaj > 0) {
      return aMaj === rMaj && (aMin > rMin || (aMin === rMin && aPatch >= rPatch));
    }
    // ^0.x — minor is the "major" for 0.x versions
    if (rMin > 0) {
      return aMaj === 0 && aMin === rMin && aPatch >= rPatch;
    }
    // ^0.0.x — exact match
    return aMaj === 0 && aMin === 0 && aPatch === rPatch;
  }

  if (range.startsWith("~")) {
    // ~1.2.3 allows >=1.2.3 <1.3.0 (same major.minor)
    return aMaj === rMaj && aMin === rMin && aPatch >= rPatch;
  }

  // No prefix — exact match
  return aMaj === rMaj && aMin === rMin && aPatch === rPatch;
}

export class PrebundleStore {
  private _bundles: PrebundleData[] = [];
  /** Flattened index: packageName -> PrebundledPackage (last-registered wins) */
  private _index = new Map<string, PrebundledPackage>();

  /**
   * Load prebundle data from a URL (static JSON asset).
   * Returns a PrebundleStore with the data already registered.
   */
  static async loadFromUrl(url: string): Promise<PrebundleStore> {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Failed to load prebundle from ${url}: ${resp.status}`);
    const data: PrebundleData = await resp.json();
    const store = new PrebundleStore();
    store.addBundle(data);
    return store;
  }

  /**
   * Create a PrebundleStore from inline PrebundleData (for bundled usage).
   */
  static fromData(...bundles: PrebundleData[]): PrebundleStore {
    const store = new PrebundleStore();
    for (const b of bundles) store.addBundle(b);
    return store;
  }

  /**
   * Register one or more pre-bundle data sets.
   * Call this before the first `install()` / `installFromManifest()`.
   */
  addBundle(bundle: PrebundleData): void {
    this._bundles.push(bundle);
    for (const [name, pkg] of Object.entries(bundle.packages)) {
      this._index.set(name, pkg);
    }
  }

  /** Check if a package is available in the prebundle store. */
  has(name: string, versionRange?: string): boolean {
    const pkg = this._index.get(name);
    if (!pkg) return false;
    if (!versionRange) return true;
    return satisfiesRange(pkg.version, versionRange);
  }

  /** Get a pre-bundled package by name. */
  get(name: string): PrebundledPackage | null {
    return this._index.get(name) ?? null;
  }

  /** List all available pre-bundled package names. */
  list(): string[] {
    return [...this._index.keys()];
  }

  /** Number of pre-bundled packages available. */
  get size(): number {
    return this._index.size;
  }

  /**
   * Write a pre-bundled package directly to the VFS.
   * Creates the node_modules/<name>/ directory and writes all files.
   *
   * @returns Number of files written
   */
  materialize(name: string, vol: MemoryVolume, nmRoot: string = "/node_modules"): number {
    const pkg = this._index.get(name);
    if (!pkg) return 0;

    const targetDir = path.join(nmRoot, name);
    vol.mkdirSync(targetDir, { recursive: true });

    let written = 0;
    for (const file of pkg.files) {
      const filePath = path.join(targetDir, file.path);
      const dir = filePath.substring(0, filePath.lastIndexOf("/")) || "/";
      if (dir !== targetDir && !vol.existsSync(dir)) {
        vol.mkdirSync(dir, { recursive: true });
      }
      vol.writeFileSync(filePath, base64ToBytes(file.content));
      written++;
    }

    return written;
  }

  /**
   * Materialize a package and all its transitive dependencies that are
   * also in the prebundle store. Returns list of materialized package names.
   */
  materializeWithDeps(
    name: string,
    vol: MemoryVolume,
    nmRoot: string = "/node_modules",
  ): string[] {
    const materialized: string[] = [];
    const visited = new Set<string>();

    const walk = (pkgName: string): void => {
      if (visited.has(pkgName)) return;
      visited.add(pkgName);

      const pkg = this._index.get(pkgName);
      if (!pkg) return;

      // Check if already installed at correct version
      let alreadyInstalled = false;
      const existingManifest = path.join(nmRoot, pkgName, "package.json");
      if (vol.existsSync(existingManifest)) {
        try {
          const current = JSON.parse(vol.readFileSync(existingManifest, "utf8"));
          if (current.version === pkg.version) alreadyInstalled = true;
        } catch { /* corrupt, reinstall */ }
      }

      if (!alreadyInstalled) {
        const count = this.materialize(pkgName, vol, nmRoot);
        if (count > 0) materialized.push(pkgName);
      }

      // Always recurse into dependencies (even if this pkg was already installed)
      for (const depName of Object.keys(pkg.dependencies)) {
        walk(depName);
      }
    };

    walk(name);
    return materialized;
  }
}
