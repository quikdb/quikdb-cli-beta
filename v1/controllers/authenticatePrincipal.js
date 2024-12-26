"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticatePrincipal = authenticatePrincipal;
const shelljs_1 = __importDefault(require("shelljs"));
const utils_1 = require("../utils");
function authenticatePrincipal(username, principalId) {
    if (!shelljs_1.default.which('dfx')) {
        console.error('quikdb is not installed. Please run `quikdb install` first.');
        return;
    }
    console.log(`Authenticating principal: ${username}`);
    console.log('connecting to blockchain...');
    const stopResult = shelljs_1.default.exec(`nohup dfx stop > dfx_start.log 2>&1 &`, {
        silent: utils_1.production,
    });
    if (stopResult.code !== 0) {
        console.error('Error starting code.', stopResult.stderr);
        return;
    }
    // Wait for dfx to initialize (give it some time)
    shelljs_1.default.exec(`sleep 5`, { silent: utils_1.production });
    const startResult = shelljs_1.default.exec(`nohup dfx start --background > dfx_start.log 2>&1 &`, {
        silent: utils_1.production,
    });
    if (startResult.code !== 0) {
        console.error('Error starting code.', startResult.stderr);
        return;
    }
    // Wait for dfx to initialize (give it some time)
    shelljs_1.default.exec(`sleep 10`, { silent: utils_1.production });
    console.log('requesting permissions to set controller');
    const setControllerResult = shelljs_1.default.exec(`dfx wallet add-controller ${principalId}`, { silent: utils_1.production });
    if (setControllerResult.code !== 0) {
        console.error('Error setting controller.', setControllerResult.stderr);
        return;
    }
    console.log('requesting permission to authorize principal');
    const authorizeControllerResult = shelljs_1.default.exec(`dfx wallet authorize ${principalId}`, { silent: utils_1.production });
    if (setControllerResult.code !== 0) {
        console.error('Error authorizing controller.', authorizeControllerResult.stderr);
        return;
    }
    // const result = shell.exec(`dfx identity use ${username}`, { silent: production });
    // if (result.code !== 0) {
    //   console.error('Error setting principal identity.', result.stderr);
    //   return false;
    // } else {
    console.log(`Authenticated as principal: ${username}`);
    return true;
    // }
}
