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
exports.downloadProjectCode = downloadProjectCode;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const _types_1 = require("../@types");
const utils_1 = require("../utils");
/**
 * Function to download project code and save it to a specified file.
 * @param {string} projectId - Encrypted project ID.
 * @param {string} token - Authorization token.
 * @param {string} outputPath - Path where the downloaded file should be saved.
 */
function downloadProjectCode(projectId, token, outputPath) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const response = yield axios_1.default.patch(`${utils_1.SERVER_URL}/v/p/${projectId}/code`, null, {
                headers: {
                    Authorization: token,
                },
                responseType: 'arraybuffer',
            });
            fs_1.default.writeFileSync(outputPath, response.data);
            console.log(`File downloaded successfully and saved to ${outputPath}`);
            return {
                status: _types_1.LogStatus.SUCCESS,
                code: _types_1.StatusCode.OK,
                message: 'File download success.',
                data: {
                    filePath: outputPath,
                },
            };
        }
        catch (error) {
            console.error('Error downloading project code:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            return {
                status: _types_1.LogStatus.FAIL,
                code: ((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) || 500,
                message: ((_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) || 'Internal server error.',
            };
        }
    });
}
