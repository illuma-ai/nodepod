import type { MemoryVolume } from './memory-volume';
import type { IScriptEngine, ExecutionOutcome, SpawnEngineConfig, EngineConfig } from './engine-types';
import { ProcessManager } from './threading/process-manager';
export declare function spawnEngine(vol: MemoryVolume, config?: SpawnEngineConfig): Promise<IScriptEngine>;
declare class ProcessWorkerAdapter implements IScriptEngine {
    private _vol;
    private _processManager;
    private _vfsBridge;
    private _cfg;
    constructor(vol: MemoryVolume, cfg?: EngineConfig);
    execute(code: string, filename?: string): Promise<ExecutionOutcome>;
    runFile(filename: string): Promise<ExecutionOutcome>;
    private _runInWorker;
    clearCache(): void;
    getVolume(): MemoryVolume;
    getProcessManager(): ProcessManager;
    teardown(): void;
}
export declare function spawnProcessWorkerEngine(vol: MemoryVolume, config?: EngineConfig): Promise<ProcessWorkerAdapter>;
export { ScriptEngine } from './script-engine';
export { WorkerSandbox } from './worker-sandbox';
export { IframeSandbox } from './iframe-sandbox';
export { ProcessWorkerAdapter };
export type { IScriptEngine, ExecutionOutcome, EngineConfig, SpawnEngineConfig, VolumeSnapshot } from './engine-types';
