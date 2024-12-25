import { CanisterMethod } from '../@types';
export declare class QuikDB {
    private accessToken;
    private canisterId;
    private url;
    private typeDeclaration;
    private agent;
    private declarationsPath;
    /**
     * Constructs a new QuikDB instance.
     * @param declarationsPath - The path to the declarations directory.
     */
    constructor(declarationsPath?: string);
    /**
     * Initializes the QuikDB instance by loading configuration,
     * setting up the environment, and loading type declarations.
     */
    init(): Promise<void>;
    /**
     * Loads the configuration from the CONFIG_FILE.
     */
    private loadConfiguration;
    /**
     * Determines if the given URL points to a local network.
     * @param url - The URL to check.
     * @returns True if the URL is local, false otherwise.
     */
    private isLocalNetwork;
    /**
     * Loads the type declaration (Actor) from the declarations directory.
     */
    private loadTypeDeclaration;
    /**
     * Gets the access token after initialization.
     */
    getAccessToken(): string | null;
    /**
     * Gets the URL after initialization.
     */
    getUrl(): string | null;
    /**
     * Gets the canister ID after initialization.
     */
    getCanisterId(): string | null;
    /**
     * Gets the loaded type declaration (Actor).
     */
    getTypeDeclaration(): any | null;
    /**
     * Calls a specified method on the canister with provided arguments.
     * @param methodName - Name of the method to call
     * @param args - Arguments to pass to the method
     * @returns The result of the canister method call
     */
    callCanisterMethod<T>(methodName: CanisterMethod, args: any[]): Promise<T>;
}
