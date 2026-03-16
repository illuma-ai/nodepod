import { describe, it, expect, beforeEach } from "vitest";
import { PrebundleStore, satisfiesRange } from "../packages/prebundle/store";
import { MemoryVolume } from "../memory-volume";
import type { PrebundleData, PrebundledPackage } from "../packages/prebundle/types";
import { bytesToBase64 } from "../helpers/byte-encoding";

// ---------------------------------------------------------------------------
// Test data factories
// ---------------------------------------------------------------------------

function makePackage(
  name: string,
  version: string,
  files: Record<string, string> = {},
  dependencies: Record<string, string> = {},
): PrebundledPackage {
  const encoder = new TextEncoder();
  return {
    name,
    version,
    files: Object.entries(files).map(([path, content]) => ({
      path,
      content: bytesToBase64(encoder.encode(content)),
    })),
    dependencies,
  };
}

function makeBundle(
  name: string,
  packages: PrebundledPackage[],
): PrebundleData {
  const pkgMap: Record<string, PrebundledPackage> = {};
  for (const pkg of packages) {
    pkgMap[pkg.name] = pkg;
  }
  return {
    name,
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    packages: pkgMap,
  };
}

// ---------------------------------------------------------------------------
// satisfiesRange
// ---------------------------------------------------------------------------

describe("satisfiesRange", () => {
  it("matches exact version", () => {
    expect(satisfiesRange("4.18.2", "4.18.2")).toBe(true);
  });

  it("rejects different exact version", () => {
    expect(satisfiesRange("4.18.2", "4.18.3")).toBe(false);
  });

  it("matches wildcard", () => {
    expect(satisfiesRange("1.0.0", "*")).toBe(true);
  });

  it("matches 'latest'", () => {
    expect(satisfiesRange("99.0.0", "latest")).toBe(true);
  });

  describe("caret ranges (^)", () => {
    it("^4.18.0 matches 4.18.2 (same major, higher patch)", () => {
      expect(satisfiesRange("4.18.2", "^4.18.0")).toBe(true);
    });

    it("^4.18.0 matches 4.19.0 (same major, higher minor)", () => {
      expect(satisfiesRange("4.19.0", "^4.18.0")).toBe(true);
    });

    it("^4.18.0 rejects 5.0.0 (different major)", () => {
      expect(satisfiesRange("5.0.0", "^4.18.0")).toBe(false);
    });

    it("^4.18.0 rejects 4.17.0 (lower minor)", () => {
      expect(satisfiesRange("4.17.0", "^4.18.0")).toBe(false);
    });

    it("^4.18.3 rejects 4.18.2 (lower patch with same minor)", () => {
      expect(satisfiesRange("4.18.2", "^4.18.3")).toBe(false);
    });

    it("^0.2.0 matches 0.2.1 (0.x: minor is major)", () => {
      expect(satisfiesRange("0.2.1", "^0.2.0")).toBe(true);
    });

    it("^0.2.0 rejects 0.3.0 (0.x: different minor)", () => {
      expect(satisfiesRange("0.3.0", "^0.2.0")).toBe(false);
    });

    it("^0.0.3 matches 0.0.3 exactly (0.0.x: exact match)", () => {
      expect(satisfiesRange("0.0.3", "^0.0.3")).toBe(true);
    });

    it("^0.0.3 rejects 0.0.4 (0.0.x: exact match only)", () => {
      expect(satisfiesRange("0.0.4", "^0.0.3")).toBe(false);
    });
  });

  describe("tilde ranges (~)", () => {
    it("~1.2.3 matches 1.2.5 (same minor, higher patch)", () => {
      expect(satisfiesRange("1.2.5", "~1.2.3")).toBe(true);
    });

    it("~1.2.3 rejects 1.3.0 (different minor)", () => {
      expect(satisfiesRange("1.3.0", "~1.2.3")).toBe(false);
    });

    it("~1.2.3 rejects 1.2.2 (lower patch)", () => {
      expect(satisfiesRange("1.2.2", "~1.2.3")).toBe(false);
    });
  });

  it("returns false for unparseable versions", () => {
    expect(satisfiesRange("abc", "^1.0.0")).toBe(false);
    expect(satisfiesRange("1.0.0", "abc")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// PrebundleStore
// ---------------------------------------------------------------------------

describe("PrebundleStore", () => {
  let store: PrebundleStore;

  const expressPkg = makePackage(
    "express",
    "4.18.2",
    {
      "package.json": JSON.stringify({ name: "express", version: "4.18.2", main: "index.js" }),
      "index.js": "module.exports = function() { return 'express'; };",
      "lib/router.js": "module.exports = {};",
    },
    { "body-parser": "^1.20.0", "cookie": "^0.5.0" },
  );

  const corsPkg = makePackage(
    "cors",
    "2.8.5",
    {
      "package.json": JSON.stringify({ name: "cors", version: "2.8.5", main: "lib/index.js" }),
      "lib/index.js": "module.exports = function cors() {};",
    },
    {},
  );

  const bodyParserPkg = makePackage(
    "body-parser",
    "1.20.2",
    {
      "package.json": JSON.stringify({ name: "body-parser", version: "1.20.2", main: "index.js" }),
      "index.js": "module.exports = {};",
    },
    {},
  );

  const cookiePkg = makePackage(
    "cookie",
    "0.5.0",
    {
      "package.json": JSON.stringify({ name: "cookie", version: "0.5.0", main: "index.js" }),
      "index.js": "module.exports = {};",
    },
    {},
  );

  const bundle = makeBundle("test-bundle", [expressPkg, corsPkg, bodyParserPkg, cookiePkg]);

  beforeEach(() => {
    store = new PrebundleStore();
    store.addBundle(bundle);
  });

  describe("has()", () => {
    it("returns true for registered package", () => {
      expect(store.has("express")).toBe(true);
    });

    it("returns false for unregistered package", () => {
      expect(store.has("lodash")).toBe(false);
    });

    it("checks version range when provided", () => {
      expect(store.has("express", "^4.18.0")).toBe(true);
      expect(store.has("express", "^5.0.0")).toBe(false);
    });
  });

  describe("get()", () => {
    it("returns package data for registered package", () => {
      const pkg = store.get("express");
      expect(pkg).not.toBeNull();
      expect(pkg!.name).toBe("express");
      expect(pkg!.version).toBe("4.18.2");
      expect(pkg!.files).toHaveLength(3);
    });

    it("returns null for unregistered package", () => {
      expect(store.get("lodash")).toBeNull();
    });
  });

  describe("list()", () => {
    it("returns all package names", () => {
      const names = store.list();
      expect(names).toContain("express");
      expect(names).toContain("cors");
      expect(names).toContain("body-parser");
      expect(names).toContain("cookie");
    });
  });

  describe("size", () => {
    it("returns number of registered packages", () => {
      expect(store.size).toBe(4);
    });
  });

  describe("materialize()", () => {
    let vol: MemoryVolume;

    beforeEach(() => {
      vol = new MemoryVolume();
    });

    it("writes all package files to the VFS", () => {
      const count = store.materialize("express", vol);
      expect(count).toBe(3);

      expect(vol.existsSync("/node_modules/express/package.json")).toBe(true);
      expect(vol.existsSync("/node_modules/express/index.js")).toBe(true);
      expect(vol.existsSync("/node_modules/express/lib/router.js")).toBe(true);
    });

    it("writes correct file content", () => {
      store.materialize("express", vol);
      const content = vol.readFileSync("/node_modules/express/index.js", "utf8");
      expect(content).toBe("module.exports = function() { return 'express'; };");
    });

    it("creates nested directories as needed", () => {
      store.materialize("express", vol);
      expect(vol.existsSync("/node_modules/express/lib")).toBe(true);
    });

    it("returns 0 for unregistered package", () => {
      const count = store.materialize("lodash", vol);
      expect(count).toBe(0);
    });

    it("uses custom nmRoot", () => {
      store.materialize("cors", vol, "/app/node_modules");
      expect(vol.existsSync("/app/node_modules/cors/lib/index.js")).toBe(true);
    });
  });

  describe("materializeWithDeps()", () => {
    let vol: MemoryVolume;

    beforeEach(() => {
      vol = new MemoryVolume();
    });

    it("materializes package and its prebundled dependencies", () => {
      const materialized = store.materializeWithDeps("express", vol);

      // express depends on body-parser and cookie, both prebundled
      expect(materialized).toContain("express");
      expect(materialized).toContain("body-parser");
      expect(materialized).toContain("cookie");
    });

    it("skips non-prebundled dependencies", () => {
      // cors has no dependencies
      const materialized = store.materializeWithDeps("cors", vol);
      expect(materialized).toEqual(["cors"]);
    });

    it("does not materialize already-installed packages", () => {
      // Pre-install express at same version
      vol.mkdirSync("/node_modules/express", { recursive: true });
      vol.writeFileSync(
        "/node_modules/express/package.json",
        JSON.stringify({ name: "express", version: "4.18.2" }),
      );

      const materialized = store.materializeWithDeps("express", vol);
      // express itself should be skipped, but its deps should still install
      expect(materialized).not.toContain("express");
      expect(materialized).toContain("body-parser");
      expect(materialized).toContain("cookie");
    });

    it("avoids circular dependency loops", () => {
      // Create a circular bundle
      const a = makePackage("pkg-a", "1.0.0", { "index.js": "" }, { "pkg-b": "^1.0.0" });
      const b = makePackage("pkg-b", "1.0.0", { "index.js": "" }, { "pkg-a": "^1.0.0" });
      const circularBundle = makeBundle("circular", [a, b]);

      const circStore = new PrebundleStore();
      circStore.addBundle(circularBundle);

      const circVol = new MemoryVolume();
      // Should not infinite loop
      const result = circStore.materializeWithDeps("pkg-a", circVol);
      expect(result).toContain("pkg-a");
      expect(result).toContain("pkg-b");
    });
  });

  describe("addBundle()", () => {
    it("merges multiple bundles", () => {
      const extraPkg = makePackage("lodash", "4.17.21", { "index.js": "" });
      const extraBundle = makeBundle("extra", [extraPkg]);

      store.addBundle(extraBundle);
      expect(store.has("lodash")).toBe(true);
      expect(store.has("express")).toBe(true); // original still there
      expect(store.size).toBe(5);
    });

    it("later bundle overrides earlier for same package", () => {
      const newExpress = makePackage("express", "5.0.0", { "index.js": "v5" });
      const overrideBundle = makeBundle("override", [newExpress]);

      store.addBundle(overrideBundle);
      expect(store.get("express")!.version).toBe("5.0.0");
    });
  });
});
