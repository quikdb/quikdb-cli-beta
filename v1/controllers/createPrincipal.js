"use strict";
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
exports.createPrincipal = createPrincipal;
const shelljs_1 = __importDefault(require("shelljs"));
const utils_1 = require("../utils");
function createPrincipal(username) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!shelljs_1.default.which('dfx')) {
            console.error('quikdb is not installed. Please run `quikdb install` first.');
            return { status: false };
        }
        console.log('requesting permissions to create new principal');
        const result = shelljs_1.default.exec(`dfx identity new ${username}`, { silent: utils_1.production });
        if (result.code !== 0) {
            console.error('error creating identity');
            return { status: false };
        }
        const seedPhraseMatch = result.stderr.match(/Your seed phrase for identity '[^']+': (.*)/);
        const seedPhrase = seedPhraseMatch ? seedPhraseMatch[1].trim() : null;
        if (!seedPhrase) {
            console.error('Error extracting seed phrase.');
            return { status: false };
        }
        return { status: true, seedPhrase };
    });
}
