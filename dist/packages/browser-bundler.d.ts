import type { MemoryVolume } from "../memory-volume";
export declare function invalidateBundleCache(): void;
export declare function attachVolume(vol: MemoryVolume): void;
export declare function setExternalPackages(packages: string[]): void;
export declare function bundleForBrowser(specifier: string): Promise<string>;
export declare class BrowserBundler {
    private vol;
    constructor(vol: MemoryVolume, options?: {
        external?: string[];
    });
    bundle(specifier: string): Promise<string>;
    clearCache(): void;
}
export default BrowserBundler;
