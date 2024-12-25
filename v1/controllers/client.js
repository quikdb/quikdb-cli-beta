"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuikDB = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const agent_1 = require("@dfinity/agent");
const utils_1 = require("../utils");
class QuikDB {
    /**
     * Constructs a new QuikDB instance.
     * @param declarationsPath - The path to the declarations directory.
     */
    constructor(declarationsPath = path_1.default.join(require('os').homedir(), '.quikdb', 'quikdb', 'src', 'declarations', 'database')) {
        this.accessToken = null;
        this.canisterId = null;
        this.url = null;
        this.typeDeclaration = null;
        this.declarationsPath = declarationsPath;
        this.agent = new agent_1.HttpAgent(); // Will be configured later
    }
    /**
     * Initializes the QuikDB instance by loading configuration,
     * setting up the environment, and loading type declarations.
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.loadConfiguration();
                if (this.url) {
                    this.agent = new agent_1.HttpAgent({ host: this.url });
                    if (this.isLocalNetwork(this.url)) {
                        try {
                            yield this.agent.fetchRootKey();
                            console.log('Fetched root key for local network.');
                        }
                        catch (error) {
                            console.warn('Failed to fetch root key. Ensure you are connected to a local replica.', error);
                        }
                    }
                }
                yield this.loadTypeDeclaration();
            }
            catch (error) {
                console.error('An error occurred during initialization:', error);
            }
        });
    }
    /**
     * Loads the configuration from the CONFIG_FILE.
     */
    loadConfiguration() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!fs_1.default.existsSync(utils_1.Tools.CONFIG_FILE)) {
                    console.error(`Configuration file not found at ${utils_1.Tools.CONFIG_FILE}. Please run "quikdb install to authenticate" to set up.`);
                    return;
                }
                const tokensData = fs_1.default.readFileSync(utils_1.Tools.CONFIG_FILE, 'utf-8');
                console.log('Current Configuration:', tokensData);
                const tokenJson = utils_1.Tools.getConfigAsJson(tokensData);
                const { accessToken, url, canisterId } = tokenJson;
                this.accessToken = accessToken;
                this.url = url;
                this.canisterId = canisterId;
            }
            catch (error) {
                console.error('Failed to load configuration:', error);
            }
        });
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
    loadTypeDeclaration() {
        return __awaiter(this, void 0, void 0, function* () {
            const didPath = path_1.default.join(this.declarationsPath, 'database.did.js');
            if (!fs_1.default.existsSync(didPath)) {
                console.error(`did.js not found in ${this.declarationsPath}.`);
                return;
            }
            try {
                const module = yield Promise.resolve(`${`${didPath}`}`).then(s => __importStar(require(s)));
                const { idlFactory } = module;
                if (!idlFactory) {
                    console.warn(`No idlFactory found in ${didPath}.`);
                    return;
                }
                if (!this.canisterId) {
                    console.error('Canister ID is not set in configuration.');
                    return;
                }
                this.typeDeclaration = agent_1.Actor.createActor(idlFactory, {
                    agent: this.agent,
                    canisterId: this.canisterId,
                });
                console.log('Loaded type declaration and created Actor.');
            }
            catch (error) {
                console.error(`Failed to load declaration from ${didPath}:`, error);
            }
        });
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
    callCanisterMethod(methodName, args) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
}
exports.QuikDB = QuikDB;
