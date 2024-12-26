import fs from 'fs';
import path from 'path';
import { idlFactory } from '../@types';
import { Actor, HttpAgent } from '@dfinity/agent';
import { Tools } from '../utils';
export class QuikDB {
    /**
     * Constructs a new QuikDB instance.
     * @param declarationsPath - The path to the declarations directory.
     */
    constructor(declarationsPath = path.join(require('os').homedir(), '.quikdb', 'quikdb', 'src', 'declarations', 'database')) {
        this.accessToken = null;
        this.canisterId = null;
        this.url = null;
        this.typeDeclaration = null;
        this.declarationsPath = declarationsPath;
        this.agent = new HttpAgent(); // Will be configured later
    }
    /**
     * Initializes the QuikDB instance by loading configuration,
     * setting up the environment, and loading type declarations.
     */
    async init() {
        try {
            this.loadConfiguration();
            if (this.url) {
                this.agent = new HttpAgent({ host: this.url });
                if (this.isLocalNetwork(this.url)) {
                    try {
                        await this.agent.fetchRootKey();
                        console.log('Fetched root key for local network.');
                    }
                    catch (error) {
                        console.warn('Failed to fetch root key. Ensure you are connected to a local replica.', error);
                    }
                }
            }
            await this.loadTypeDeclaration();
        }
        catch (error) {
            console.error('An error occurred during initialization:', error);
        }
    }
    /**
     * Loads the configuration from the CONFIG_FILE.
     */
    async loadConfiguration() {
        try {
            if (!fs.existsSync(Tools.CONFIG_FILE)) {
                console.error(`Configuration file not found at ${Tools.CONFIG_FILE}. Please run "quikdb install to authenticate" to set up.`);
                return;
            }
            const tokensData = fs.readFileSync(Tools.CONFIG_FILE, 'utf-8');
            console.log('Current Configuration:', tokensData);
            const tokenJson = Tools.getConfigAsJson(tokensData);
            const { accessToken, url, canisterId } = tokenJson;
            this.accessToken = accessToken;
            this.url = url;
            this.canisterId = canisterId;
        }
        catch (error) {
            console.error('Failed to load configuration:', error);
        }
    }
    /**
     * Determines if the given URL points to a local network.
     * @param url - The URL to check.
     * @returns True if the URL is local, false otherwise.
     */
    isLocalNetwork(url) {
        const localHosts = ['localhost', '127.0.0.1'];
        try {
            const parsedUrl = new URL(url);
            return localHosts.includes(parsedUrl.hostname);
        }
        catch (error) {
            console.error('Invalid URL format:', url);
            return false;
        }
    }
    /**
     * Loads the type declaration (Actor) from the declarations directory.
     */
    async loadTypeDeclaration() {
        // const didPath = path.join(this.declarationsPath, 'database.did.js');
        // if (!fs.existsSync(didPath)) {
        //   console.error(`did.js not found in ${this.declarationsPath}.`);
        //   return;
        // }
        try {
            // const module = await import(`${didPath}`);
            // const { idlFactory } = module;
            // if (!idlFactory) {
            //   console.warn(`No idlFactory found in ${didPath}.`);
            //   return;
            // }
            if (!this.canisterId) {
                console.error('Canister ID is not set in configuration.');
                return;
            }
            this.typeDeclaration = Actor.createActor(idlFactory, {
                agent: this.agent,
                canisterId: this.canisterId,
            });
            console.log('Loaded type declaration and created Actor.');
        }
        catch (error) {
            console.error(`Failed to load declaration:`, error);
        }
    }
    /**
     * Gets the access token after initialization.
     */
    getAccessToken() {
        return this.accessToken;
    }
    /**
     * Gets the URL after initialization.
     */
    getUrl() {
        return this.url;
    }
    /**
     * Gets the canister ID after initialization.
     */
    getCanisterId() {
        return this.canisterId;
    }
    /**
     * Gets the loaded type declaration (Actor).
     */
    getTypeDeclaration() {
        return this.typeDeclaration;
    }
    /**
     * Calls a specified method on the canister with provided arguments.
     * @param methodName - Name of the method to call
     * @param args - Arguments to pass to the method
     * @returns The result of the canister method call
     */
    async callCanisterMethod(methodName, args) {
        try {
            // @ts-ignore
            if (!this.typeDeclaration) {
                throw new Error('No canister Actor loaded.');
            }
            if (typeof this.typeDeclaration[methodName] !== 'function') {
                throw new Error(`Method "${methodName}" does not exist on the canister.`);
            }
            return this.typeDeclaration[methodName](...args);
        }
        catch (error) {
            throw new Error(`Error calling ${methodName}: ${error}`);
        }
    }
}
//# sourceMappingURL=client.js.map