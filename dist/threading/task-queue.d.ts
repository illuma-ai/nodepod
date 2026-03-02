import type { WorkerPool } from "./worker-pool";
import type { OffloadTask, OffloadResult, TransformTask, TransformResult, ExtractTask, ExtractResult, BuildTask, BuildResult } from "./offload-types";
export declare class TaskQueue {
    private queue;
    private pool;
    private dispatching;
    constructor(pool: WorkerPool);
    submit<T extends OffloadTask>(task: T): Promise<T extends TransformTask ? TransformResult : T extends ExtractTask ? ExtractResult : T extends BuildTask ? BuildResult : OffloadResult>;
    submitBatch(tasks: OffloadTask[]): Promise<OffloadResult[]>;
    cancel(taskId: string): boolean;
    get pending(): number;
    private dispatch;
    private rejectAll;
    private executeTask;
}
