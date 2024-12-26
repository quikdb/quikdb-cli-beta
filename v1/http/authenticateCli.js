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
exports.authenticateCli = authenticateCli;
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../utils");
function authenticateCli(authenticationRequest) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            console.info('seeking authorization!');
            const body = authenticationRequest.identity
                ? {
                    identity: authenticationRequest.identity,
                    username: authenticationRequest.username,
                    projectTokenRef: authenticationRequest.projectTokenRef,
                }
                : {
                    email: authenticationRequest.email,
                    username: authenticationRequest.username,
                    password: authenticationRequest.password,
                    projectTokenRef: authenticationRequest.projectTokenRef,
                    principalId: authenticationRequest.principalId,
                };
            const response = yield axios_1.default.post(`${utils_1.SERVER_URL}/a/signinWithCli`, body);
            return {
                status: true,
                code: response.status,
                data: response.data,
            };
        }
        catch (error) {
            console.error('Authorization Error:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.statusText) || 'server down');
            console.log('if you are authenticating with internet identity you may need to run "quikdb config" again.');
            return {
                status: false,
                code: (_b = error.response) === null || _b === void 0 ? void 0 : _b.status,
                data: (_c = error.response) === null || _c === void 0 ? void 0 : _c.data,
            };
        }
    });
}
