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
exports.program = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const shelljs_1 = __importDefault(require("shelljs"));
const readlineSync = __importStar(require("readline-sync"));
const utils_1 = require("../utils");
const init_1 = require("./init");
Object.defineProperty(exports, "program", { enumerable: true, get: function () { return init_1.program; } });
const _types_1 = require("../@types");
const controllers_1 = require("../controllers");
const http_1 = require("../http");
const homeDir = os.homedir();
const quikdbDir = path.resolve(homeDir, '.quikdb', 'quikdb');
const distDir = path.resolve(homeDir, '.quikdb', 'dist.zip');
init_1.program
    .command('install')
    .description('Checks if quikdb is installed, installs it if necessary')
    .action((options) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    let principalId;
    let password;
    if (fs.existsSync(utils_1.Tools.CONFIG_FILE)) {
        const configData = fs.readFileSync(utils_1.Tools.CONFIG_FILE, 'utf-8');
        const configJson = utils_1.Tools.getConfigAsJson(configData);
        const identity = configJson === null || configJson === void 0 ? void 0 : configJson.identity;
        const username = configJson.username;
        const projectTokenRef = configJson === null || configJson === void 0 ? void 0 : configJson.projectTokenRef;
        if (!identity) {
            password = readlineSync.question('Please enter your account password: ');
            if (!password) {
                console.error('password is required to proceed.');
                return;
            }
            configJson.password = password;
        }
        const isDfxInstalled = utils_1.Tools.checkAndInstallDfx();
        if (!isDfxInstalled) {
            (0, controllers_1.installDfx)();
        }
        const principal = yield (0, controllers_1.getPrincipal)(username);
        if (!principal.status) {
            console.error('Failed to retrieve principal ID.');
            return;
        }
        principalId = (_a = principal.data) === null || _a === void 0 ? void 0 : _a.principalId;
        if (!identity)
            configJson.principalId = principalId;
        console.log({ configJson });
        /************* validating config json ************/
        if (identity) {
            const validConfigJson = utils_1.Tools.hasProperties(configJson, Object.keys(_types_1.sampleAuthForIIRequest));
            if (!validConfigJson) {
                console.error('Invalid configuration data. Please run "quikdb config".');
                return;
            }
            console.log('configuration data is valid for ii');
        }
        else {
            const validConfigJson = utils_1.Tools.hasProperties(configJson, Object.keys(_types_1.sampleAuthRequest));
            if (!validConfigJson) {
                console.error('Invalid configuration data. Please run "quikdb config".');
                return;
            }
            console.log('configuration data is valid.');
        }
        const auth = yield (0, http_1.authenticateCli)(configJson);
        if (!auth.status) {
            console.error('Failed to authenticate with the server.');
            return;
        }
        const principalAuth = (0, controllers_1.authenticatePrincipal)(username, principalId);
        if (!principalAuth)
            return;
        ((_b = principal.data) === null || _b === void 0 ? void 0 : _b.seedPhrase) &&
            utils_1.Tools.appendToConfigFile('seedPhrase', (_c = principal.data) === null || _c === void 0 ? void 0 : _c.seedPhrase);
        utils_1.Tools.appendToConfigFile('accessToken', (_e = (_d = auth.data) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.accessToken);
        shelljs_1.default.exec(`rm -rf ${quikdbDir}`, { silent: utils_1.production });
        console.log({ homeDir });
        console.log({ path: quikdbDir });
        yield utils_1.Tools.fetchCode('https://github.com/quikdb/quikdb-app-beta', quikdbDir);
        if (shelljs_1.default.cd(quikdbDir).code !== 0) {
            console.error('Failed to change directory. Please check if the directory exists.');
            return;
        }
        const canisterUrl = (0, controllers_1.deployToLocal)(principalId);
        if (!canisterUrl) {
            return;
        }
        const payload = JSON.stringify({
            id: auth.data.data.project._id,
        });
        const encryptionResponse = yield (0, http_1.encryptUserData)(payload, projectTokenRef);
        const projectId = encryptionResponse.data.encryptedData;
        const token = (_g = (_f = auth.data) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.accessToken;
        shelljs_1.default.cd('~/.quikdb');
        const folderToZip = 'quikdb';
        const zipFileName = 'dist.zip';
        const zipCommand = `zip -r ${zipFileName} ${folderToZip}`;
        const result = shelljs_1.default.exec(zipCommand, { silent: utils_1.production });
        if (result.code === 0) {
            console.log('packaging success!');
        }
        else {
            console.error('packaging failed!');
        }
        yield (0, http_1.uploadProjectCode)(projectId, token, distDir);
        const canisterDetails = utils_1.Tools.parseURL(canisterUrl);
        const canisterPayload = {
            databaseVersion: auth.data.data.project.databaseVersion,
            url: canisterDetails.baseUrl,
            canisterId: canisterDetails.id,
            controllers: [principalId],
        };
        utils_1.Tools.appendToConfigFile('canisterId', canisterPayload === null || canisterPayload === void 0 ? void 0 : canisterPayload.canisterId);
        utils_1.Tools.appendToConfigFile('url', canisterPayload === null || canisterPayload === void 0 ? void 0 : canisterPayload.url);
        console.log({ canisterPayload });
    }
    else {
        console.log('No configuration file found.');
    }
}));
