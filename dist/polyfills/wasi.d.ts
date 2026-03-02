export interface WASI {
    readonly wasiImport: Record<string, Function>;
    start(_instance: object): number;
    initialize(_instance: object): void;
    getImportObject(): Record<string, Record<string, Function>>;
}
interface WASIConstructor {
    new (_options?: object): WASI;
    (this: any, _options?: object): void;
    prototype: any;
}
export declare const WASI: WASIConstructor;
declare const _default: {
    WASI: WASIConstructor;
};
export default _default;
