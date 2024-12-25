"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setOwner = setOwner;
const shelljs_1 = __importDefault(require("shelljs"));
const utils_1 = require("../utils");
function setOwner(canisterName, principal) {
    console.log(`Testing canister functions for ${canisterName}...`);
    const result = shelljs_1.default.exec(`dfx canister call ${canisterName} setOwner ${principal}`, { silent: utils_1.production });
    if (result.code !== 0) {
        console.error('Error testing canister.');
    }
    else {
        console.log('Test completed successfully.');
    }
}
