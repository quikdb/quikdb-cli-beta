"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployToLocal = deployToLocal;
const shelljs_1 = __importDefault(require("shelljs"));
const utils_1 = require("../utils");
function deployToLocal(principalId) {
    if (!shelljs_1.default.which('dfx')) {
        console.error('quikdb is not installed. Please run `quikdb install` first.');
        return;
    }
    console.log('requesting permissions to create virtual database');
    const createCanisterResult = shelljs_1.default.exec(`dfx canister create database`, { silent: utils_1.production });
    if (createCanisterResult.code !== 0) {
        console.error('Error starting code.', createCanisterResult.stderr);
        return;
    }
    console.log('requesting permissions to run local tests');
    const createTestCanisterResult = shelljs_1.default.exec(`dfx canister create test`, { silent: utils_1.production });
    if (createTestCanisterResult.code !== 0) {
        console.error('Error starting code.', createTestCanisterResult.stderr);
        return;
    }
    console.log('requesting permissions to build variations');
    const buildResult = shelljs_1.default.exec(`dfx build`, { silent: utils_1.production });
    if (buildResult.code !== 0) {
        console.error('Error building code.', buildResult.stderr);
        return;
    }
    console.log('requesting permissions to set up your database');
    shelljs_1.default.exec(`dfx ledger fabricate-cycles --t 10000 --canister database`, { silent: utils_1.production });
    console.log('requesting permissions to deposit testnets');
    shelljs_1.default.exec(`dfx canister deposit-cycles --all 10T`, { silent: utils_1.production });
    const args = `{"initOwner": ${principalId}}`;
    console.log('requesting permissions to deploy to testnet');
    const deployResult = shelljs_1.default.exec(`dfx deploy`, { silent: utils_1.production });
    if (deployResult.code !== 0) {
        console.error('Error deploying to local canister.', deployResult.stderr);
    }
    else {
        console.log('Code deployed to local canister successfully.');
        const backendUrlMatch = deployResult.stderr.match(/database:\s(http:\/\/[^\s]+)/);
        if (backendUrlMatch) {
            console.log('requesting permissions to generate codes');
            const generateResult = shelljs_1.default.exec(`dfx generate database`, { silent: utils_1.production });
            if (generateResult.code !== 0) {
                console.error('Error generating declarations file', generateResult.stderr);
                return;
            }
            return backendUrlMatch[1];
        }
        else {
            console.log('Backend URL not found.');
        }
    }
}
