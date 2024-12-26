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
exports.deployToProduction = deployToProduction;
const shelljs_1 = __importDefault(require("shelljs"));
const utils_1 = require("../utils");
function deployToProduction(canisterName) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Deploying ${canisterName} to the IC network...`);
        const buildResult = shelljs_1.default.exec(`dfx build`, { silent: utils_1.production });
        if (buildResult.code !== 0) {
            console.error('Error building code.');
            return;
        }
        const canisterIdResult = shelljs_1.default.exec(`dfx deploy --network ic`, { silent: utils_1.production });
        if (canisterIdResult.code !== 0) {
            console.error('Error retrieving canister ID.');
        }
        const canisterId = canisterIdResult.stdout.trim();
        console.log(`Canister created with ID: ${canisterId}`);
    });
}
