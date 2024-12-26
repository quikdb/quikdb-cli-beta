export declare class Tools {
    static CONFIG_DIR: string;
    static CONFIG_FILE: string;
    constructor();
    static ensureConfigDirectory(): void;
    static appendToConfigFile(key: string, value: string, filePath?: string): void;
    static getConfigAsJson(configData: string): object;
    static isOfType<T>(obj: any, typeCheck: (obj: any) => obj is T): boolean;
    static hasProperties<T>(obj: any, properties: (keyof T)[]): boolean;
    static checkAndInstallDfx(): boolean;
    static fetchCode(repo: string, localPath: string): Promise<void>;
    /**
     * Extracts query parameters and base URL from a given URL.
     */
    static parseURL(url: string): {
        baseUrl: string;
        canisterId: string;
        id: string;
    };
}
//# sourceMappingURL=toolbox.d.ts.map