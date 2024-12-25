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
exports.getPrincipal = getPrincipal;
const shelljs_1 = __importDefault(require("shelljs"));
const createPrincipal_1 = require("./createPrincipal");
const utils_1 = require("../utils");
function getPrincipal(username) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!shelljs_1.default.which('dfx')) {
            console.error('quikdb is not installed. Please run `quikdb install` first.');
            return { status: false };
        }
        let principalIdResult = shelljs_1.default.exec(`dfx identity get-principal --identity ${username}`, { silent: utils_1.production });
        let seedPhrase = '';
        if (principalIdResult.code !== 0) {
            console.error('Error retrieving principal ID.');
            console.log('creating principal...');
            const createPrincipalResponse = yield (0, createPrincipal_1.createPrincipal)(username);
            if (!createPrincipalResponse.status) {
                console.info('installation failed.');
                return { status: false };
            }
            principalIdResult = shelljs_1.default.exec(`dfx identity get-principal --identity ${username}`, { silent: utils_1.production });
            seedPhrase = createPrincipalResponse.seedPhrase;
        }
        const principalId = principalIdResult.stdout.trim();
        console.log(`Current Principal ID: ${principalId}`);
        return { status: true, data: { principalId, seedPhrase } };
    });
}
