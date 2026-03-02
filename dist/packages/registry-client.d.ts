export interface VersionDetail {
    name: string;
    version: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    peerDependenciesMeta?: Record<string, {
        optional?: boolean;
    }>;
    optionalDependencies?: Record<string, string>;
    dist: {
        tarball: string;
        shasum: string;
        integrity?: string;
    };
    main?: string;
    module?: string;
    exports?: Record<string, unknown>;
    bin?: Record<string, string> | string;
}
export interface PackageMetadata {
    name: string;
    'dist-tags': {
        latest: string;
        [label: string]: string;
    };
    versions: Record<string, VersionDetail>;
    time?: Record<string, string>;
}
export interface RegistryConfig {
    endpoint?: string;
    metadataCache?: Map<string, PackageMetadata>;
}
export declare class RegistryClient {
    private baseUrl;
    private metadataStore;
    constructor(config?: RegistryConfig);
    fetchManifest(name: string): Promise<PackageMetadata>;
    fetchVersion(name: string, version: string): Promise<VersionDetail>;
    getLatestVersion(name: string): Promise<string>;
    listVersions(name: string): Promise<string[]>;
    getTarballUrl(name: string, version: string): Promise<string>;
    downloadArchive(tarballUrl: string): Promise<ArrayBuffer>;
    flushCache(): void;
}
export default RegistryClient;
