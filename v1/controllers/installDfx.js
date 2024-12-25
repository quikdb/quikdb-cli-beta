"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installDfx = installDfx;
const shelljs_1 = __importDefault(require("shelljs"));
const utils_1 = require("../utils");
function installDfx() {
    if ((shelljs_1.default.exec('sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"').code !== 0, { silent: utils_1.production })) {
        console.error('Error installing dfx.');
        shelljs_1.default.exit(1);
    }
    else {
        console.log('dfx installed successfully.');
    }
}
