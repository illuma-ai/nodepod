export declare function setProxy(url: string | null): void;
export declare function getProxy(): string | null;
export declare function isProxyActive(): boolean;
export declare function proxiedFetch(url: string, init?: RequestInit): Promise<Response>;
export declare function resolveProxyUrl(url: string): string;
