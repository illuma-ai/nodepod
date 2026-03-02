export interface SandboxPageConfig {
    nodepodUrl?: string;
    enableServiceWorker?: boolean;
}
export declare function getSandboxPageHtml(config?: SandboxPageConfig | string): string;
export declare function getSandboxHostingConfig(): object;
export interface GeneratedSandboxFiles {
    'index.html': string;
    'vercel.json': string;
    '__sw__.js'?: string;
}
export declare function generateSandboxDeployment(config?: SandboxPageConfig | string): GeneratedSandboxFiles;
export declare const SANDBOX_DEPLOYMENT_GUIDE: string;
