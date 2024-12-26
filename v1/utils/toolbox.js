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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tools = void 0;
const shelljs_1 = __importDefault(require("shelljs"));
const simple_git_1 = __importDefault(require("simple-git"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const git = (0, simple_git_1.default)();
class Tools {
    constructor() { }
    static ensureConfigDirectory() {
        if (!fs.existsSync(this.CONFIG_DIR)) {
            fs.mkdirSync(this.CONFIG_DIR, { recursive: true });
            console.log(`Created config directory: ${this.CONFIG_DIR}`);
        }
    }
    static appendToConfigFile(key, value, filePath) {
        this.ensureConfigDirectory();
        const configEntry = `${key}& ${value}\n`;
        try {
            if (filePath) {
                fs.writeFileSync(filePath, configEntry);
                return;
            }
            fs.appendFileSync(this.CONFIG_FILE, configEntry);
            console.log(`Appended to config: ${key} = ${value}`);
        }
        catch (error) {
            console.error('Error appending to configuration file:', error);
        }
    }
    static getConfigAsJson(configData) {
        const configJson = {};
        const lines = configData.split('\n');
        lines.forEach((line) => {
            if (line.trim()) {
                const [key, value] = line.split('&').map((str) => str.trim());
                if (key && value) {
                    configJson[key] = value;
                }
            }
        });
        return configJson;
    }
    static isOfType(obj, typeCheck) {
        return typeCheck(obj);
    }
    static hasProperties(obj, properties) {
        return properties.every((property) => property in obj);
    }
    static checkAndInstallDfx() {
        if (shelljs_1.default.which('dfx')) {
            console.log('quikdb is already installed on your system.');
            return true;
        }
        else {
            console.log('quikdb not found. Installing quikdb...');
            return false;
        }
    }
    static fetchCode(repo, localPath) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('connecting to manager.');
            yield git.clone(repo, `${localPath}`);
        });
    }
    /**
     * Extracts query parameters and base URL from a given URL.
     */
    static parseURL(url) {
        const baseUrl = url.split('?')[0];
        const queryString = url.split('?')[1];
        if (!queryString) {
            return { baseUrl, canisterId: '', id: '' };
        }
        const params = queryString.split('&');
        let canisterId = '';
        let id = '';
        params.forEach((param) => {
            const [key, value] = param.split('=');
            if (key === 'canisterId') {
                canisterId = value;
            }
            else if (key === 'id') {
                id = value;
            }
        });
        return { baseUrl, canisterId, id };
    }
}
exports.Tools = Tools;
_a = Tools;
Tools.CONFIG_DIR = path.join((process.env.HOME || process.env.USERPROFILE), '.quikdb');
Tools.CONFIG_FILE = path.join(_a.CONFIG_DIR, 'config');
