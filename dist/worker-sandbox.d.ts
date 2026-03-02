import type { MemoryVolume } from './memory-volume';
import type { IScriptEngine, ExecutionOutcome, EngineConfig } from './engine-types';
export declare class WorkerSandbox implements IScriptEngine {
    private thread;
    private endpoint;
    private vol;
    private cfg;
    private ready;
    private onFileChange;
    private onFileDelete;
    constructor(vol: MemoryVolume, cfg?: EngineConfig);
    private bootstrap;
    private attachVolumeSync;
    execute(code: string, filename?: string): Promise<ExecutionOutcome>;
    runFile(filename: string): Promise<ExecutionOutcome>;
    clearCache(): void;
    getVolume(): MemoryVolume;
    terminate(): void;
}
