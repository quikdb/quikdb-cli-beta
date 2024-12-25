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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readlineSync = __importStar(require("readline-sync"));
const fs = __importStar(require("fs"));
const utils_1 = require("../utils");
const init_1 = require("./init");
const email_validator_1 = __importDefault(require("email-validator"));
const controllers_1 = require("../controllers");
init_1.program
    .command('config')
    .option('-u, --username <username>', 'username for the account')
    .option('-e, --email <email>', 'email for the account')
    .option('-i, --identity <identity>', 'identity for the account')
    .description('Dynamically add a config entry')
    .action((options) => {
    if (!options.identity && !options.email) {
        console.error('email or identity is required');
        return;
    }
    if (!options.username) {
        console.error('username is required.');
        return;
    }
    const projectTokenRef = readlineSync.question('Please enter your project token: ');
    if (!projectTokenRef) {
        console.error('Token is required to proceed.');
        return;
    }
    utils_1.Tools.ensureConfigDirectory();
    fs.writeFileSync(utils_1.Tools.CONFIG_FILE, '');
    if (email_validator_1.default.validate(options.email)) {
        utils_1.Tools.appendToConfigFile('email', options.email);
    }
    else if (options.identity) {
        utils_1.Tools.appendToConfigFile('identity', options.identity);
    }
    utils_1.Tools.appendToConfigFile('username', options.username);
    utils_1.Tools.appendToConfigFile('projectTokenRef', projectTokenRef);
    const isDfxInstalled = utils_1.Tools.checkAndInstallDfx();
    if (!isDfxInstalled) {
        (0, controllers_1.installDfx)();
    }
    console.log('config success!');
});
