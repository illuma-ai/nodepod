import { EventEmitter } from "./events";
export declare function getActiveInterfaceCount(): number;
export declare function setActiveInterfaceCount(n: number): void;
export declare function resetActiveInterfaceCount(): void;
export interface InterfaceConfig {
    input?: unknown;
    output?: unknown;
    terminal?: boolean;
    prompt?: string;
    historySize?: number;
    completer?: (line: string) => [string[], string] | void;
    crlfDelay?: number;
    escapeCodeTimeout?: number;
    tabSize?: number;
}
export declare function emitKeypressEvents(stream: unknown, _iface?: Interface): void;
export interface Interface extends EventEmitter {
    _promptStr: string;
    _input: unknown;
    _output: unknown;
    _closed: boolean;
    _lineBuffer: string;
    _pendingQuestions: Array<{
        query: string;
        handler: (answer: string) => void;
    }>;
    terminal: boolean;
    line: string;
    cursor: number;
    _refreshLine(): void;
    _onKeypress(char: string | undefined, key: any): void;
    _onData(text: string): void;
    prompt(preserveCursor?: boolean): void;
    setPrompt(text: string): void;
    getPrompt(): string;
    question(query: string, optsOrHandler?: unknown, handler?: (answer: string) => void): void;
    pause(): this;
    resume(): this;
    close(): void;
    write(data: string | null, _key?: {
        ctrl?: boolean;
        name?: string;
        meta?: boolean;
        shift?: boolean;
        sequence?: string;
    }): void;
    getCursorPos(): {
        rows: number;
        cols: number;
    };
    [Symbol.asyncIterator](): AsyncGenerator<string, void, undefined>;
}
interface InterfaceConstructor {
    new (cfg?: InterfaceConfig): Interface;
    (this: any, cfg?: InterfaceConfig): void;
    prototype: any;
}
export declare const Interface: InterfaceConstructor;
export declare function createInterface(cfgOrInput?: InterfaceConfig | unknown, output?: unknown): Interface;
export declare function clearLine(stream: unknown, dir: number, done?: () => void): boolean;
export declare function clearScreenDown(stream: unknown, done?: () => void): boolean;
export declare function cursorTo(stream: unknown, x: number, yOrDone?: number | (() => void), done?: () => void): boolean;
export declare function moveCursor(stream: unknown, dx: number, dy: number, done?: () => void): boolean;
export declare const promises: {
    createInterface(cfg?: InterfaceConfig): {
        question(query: string): Promise<string>;
        close(): void;
        [Symbol.asyncIterator](): AsyncGenerator<string, void, undefined>;
    };
};
declare const _default: {
    Interface: InterfaceConstructor;
    createInterface: typeof createInterface;
    clearLine: typeof clearLine;
    clearScreenDown: typeof clearScreenDown;
    cursorTo: typeof cursorTo;
    moveCursor: typeof moveCursor;
    emitKeypressEvents: typeof emitKeypressEvents;
    promises: {
        createInterface(cfg?: InterfaceConfig): {
            question(query: string): Promise<string>;
            close(): void;
            [Symbol.asyncIterator](): AsyncGenerator<string, void, undefined>;
        };
    };
};
export default _default;
