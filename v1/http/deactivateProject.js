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
exports.deactivateProject = deactivateProject;
const axios_1 = __importDefault(require("axios"));
const _types_1 = require("../@types");
const utils_1 = require("../utils");
/**
 * Function to encrypt user data by making a POST request to /v/p/projectId/activate
 */
function deactivateProject(projectId, payload, accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const response = yield axios_1.default.post(`${utils_1.SERVER_URL}/v/p/${projectId}/activate`, { data: payload }, {
                headers: {
                    Authorization: accessToken,
                    'Content-Type': 'application/json',
                },
            });
            return {
                status: _types_1.LogStatus.SUCCESS,
                code: _types_1.StatusCode.OK,
                message: 'Data encrypted successfully.',
                data: response.data.data,
            };
        }
        catch (error) {
            // Handle errors and return a structured response
            console.error('Error encrypting user data:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            return {
                status: _types_1.LogStatus.FAIL,
                code: ((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) || 500,
                message: ((_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) || 'Internal server error.',
            };
        }
    });
}
