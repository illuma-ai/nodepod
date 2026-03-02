import type { TerminalOptions, TerminalTheme } from "./types";
export interface TerminalWiring {
    onCommand: (cmd: string) => Promise<void>;
    getSendStdin: () => ((data: string) => void) | null;
    getIsStdinRaw: () => boolean;
    getActiveAbort: () => AbortController | null;
    setActiveAbort: (ac: AbortController | null) => void;
}
export declare class NodepodTerminal {
    private _term;
    private _fitAddon;
    private _dataDisposable;
    private _resizeHandler;
    private _lineBuffer;
    private _history;
    private _historyIndex;
    private _savedLine;
    private _running;
    private _cwd;
    private _promptFn;
    private _theme;
    private _opts;
    private _wiring;
    constructor(opts: TerminalOptions);
    _wireExecution(wiring: TerminalWiring): void;
    _setRunning(running: boolean): void;
    _writePrompt(): void;
    _getCols(): number;
    _getRows(): number;
    _writeOutput(text: string, isError?: boolean): void;
    attach(target: HTMLElement | string): void;
    detach(): void;
    clear(): void;
    input(text: string): void;
    setTheme(theme: Partial<TerminalTheme>): void;
    fit(): void;
    write(text: string): void;
    writeln(text: string): void;
    showPrompt(): void;
    setCwd(cwd: string): void;
    getCwd(): string;
    get xterm(): any;
    private _handleInput;
    private _historyUp;
    private _historyDown;
    private _replaceLineWith;
    private _executeCommand;
}
