export declare const VERSIONS: {
    readonly NODE: "v22.12.0";
    readonly NODE_BARE: "22.12.0";
    readonly NPM: "10.0.0";
    readonly PNPM: "9.15.4";
    readonly YARN: "4.6.0";
    readonly BUN: "1.1.38";
    readonly BUN_V: "v1.1.38";
    readonly GIT: "2.43.0";
};
export declare const NODE_SUB_VERSIONS: {
    readonly node: "22.12.0";
    readonly v8: "11.3.244.8";
    readonly uv: "1.44.2";
    readonly modules: "115";
    readonly openssl: "3.0.13";
    readonly napi: "9";
    readonly webcontainer: "1.0.0";
};
export declare const NPM_REGISTRY_URL = "https://registry.npmjs.org";
export declare const NPM_REGISTRY_URL_SLASH = "https://registry.npmjs.org/";
export declare const PINNED_PAKO = "2.1.0";
export declare const CDN_PAKO = "https://esm.sh/pako@2.1.0";
export declare const RESOLVE_EXTENSIONS: readonly [".js", ".ts", ".jsx", ".tsx", ".mjs", ".cjs", ".json"];
export declare const MAIN_FIELD_EXTENSIONS: readonly [".js", ".ts", ".tsx", ".mts", ".jsx", ".json", ".mjs", ".cjs"];
export declare const INDEX_FILES: readonly ["index.js", "index.ts", "index.tsx", "index.mjs", "index.cjs"];
export declare const IMPORTS_FIELD_EXTENSIONS: readonly [".js", ".ts", ".cjs", ".mjs", ".json"];
export declare const ESBUILD_LOADER_MAP: Record<string, string>;
export declare const MOCK_OS: {
    readonly PLATFORM: "linux";
    readonly ARCH: "x64";
    readonly TYPE: "Linux";
    readonly RELEASE: "5.10.0";
    readonly VERSION: "#1 SMP";
    readonly MACHINE: "x86_64";
    readonly HOSTNAME: "localhost";
    readonly HOMEDIR: "/home/user";
    readonly TMPDIR: "/tmp";
    readonly SHELL: "/bin/bash";
    readonly USERNAME: "user";
    readonly ENDIANNESS: "LE";
};
export declare const MOCK_IDS: {
    readonly UID: 1000;
    readonly GID: 1000;
};
export declare const MOCK_FS: {
    readonly BLOCK_SIZE: 4096;
    readonly BLOCK_CALC_SIZE: 512;
};
export declare const MOCK_CPU: {
    readonly MODEL: "Virtual CPU";
    readonly SPEED: 2400;
    readonly COUNT: 2;
};
export declare const MOCK_MEMORY: {
    readonly TOTAL: number;
    readonly FREE: number;
    readonly RSS: number;
    readonly HEAP_TOTAL: number;
    readonly HEAP_USED: number;
    readonly EXTERNAL: number;
};
export declare const MOCK_LOADAVG: readonly [number, number, number];
export declare const DEFAULT_TERMINAL: {
    readonly COLUMNS: 80;
    readonly ROWS: 24;
    readonly FONT_SIZE: 13;
};
export declare const MOCK_PROCESS: {
    readonly PID: 1;
    readonly PPID: 0;
    readonly TITLE: "node";
    readonly EXEC_PATH: "/usr/local/bin/node";
};
export declare const DEFAULT_ENV: {
    readonly NODE_ENV: "development";
    readonly PATH: "/usr/local/bin:/usr/bin:/bin";
    readonly HOME: "/";
    readonly SHELL: "/bin/sh";
    readonly TERM: "xterm-256color";
    readonly COLORTERM: "truecolor";
    readonly REQUIRES_WASM: "true";
    readonly npm_config_user_agent: "npm/10.0.0 node/v22.12.0 linux x64 workspaces/false";
    readonly npm_execpath: "/usr/local/lib/node_modules/npm/bin/npm-cli.js";
    readonly npm_node_execpath: "/usr/local/bin/node";
};
export declare const TIMEOUTS: {
    readonly SYNC_OP: 120000;
    readonly WAIT_LOOP_TICK: 200;
    readonly SW_HEARTBEAT: 20000;
    readonly WORKER_REAP_INTERVAL: 10000;
    readonly WORKER_IDLE_TIMEOUT: 30000;
    readonly WORKER_INIT_TIMEOUT: 30000;
    readonly HTTP_KEEP_ALIVE: 5000;
    readonly HTTP_HEADERS: 60000;
    readonly HTTP_DISPATCH_SAFETY: 120000;
};
export declare const LIMITS: {
    readonly MAX_RESOLVE_DEPTH: 50;
    readonly MODULE_CACHE_MAX: 2000;
    readonly MAX_WORKERS_CAP: 6;
};
export declare const PORT_RANGE: {
    readonly BASE: 3000;
    readonly RANGE: 1000;
};
export declare const DEFAULT_NODEPOD_CDN = "https://unpkg.com/@scelar/nodepod/dist/index.js";
export declare const MOCK_PID: {
    readonly BASE: 1000;
    readonly RANGE: 10000;
};
export declare const LS_BLOCK_SIZE = 512;
export declare const YES_REPEAT_COUNT = 100;
export declare const WS_OPCODE: {
    readonly TEXT: 1;
    readonly BINARY: 2;
    readonly CLOSE: 8;
    readonly PING: 9;
    readonly PONG: 10;
};
