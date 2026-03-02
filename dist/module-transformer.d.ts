import type { MemoryVolume } from "./memory-volume";
export declare function prepareTransformer(): Promise<void>;
export declare function isTransformerLoaded(): boolean;
export declare function convertFile(source: string, filePath: string): Promise<string>;
export declare function convertFileDirect(source: string, filePath: string): Promise<string>;
export declare function convertPackage(vol: MemoryVolume, packageDir: string, onProgress?: (msg: string) => void): Promise<number>;
