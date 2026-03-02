declare const PRECOMPILE_THRESHOLD: number;
export declare function precompileWasm(bytes: Uint8Array | ArrayBuffer): void;
export declare function getCachedModule(bytes: BufferSource): WebAssembly.Module | null;
export declare function compileWasmInWorker(bytes: Uint8Array | ArrayBuffer): Promise<WebAssembly.Module>;
export declare function needsAsyncCompile(bytes: BufferSource): boolean;
export { PRECOMPILE_THRESHOLD };
