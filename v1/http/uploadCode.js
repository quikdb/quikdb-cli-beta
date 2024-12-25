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
exports.uploadProjectCode = uploadProjectCode;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const fs_1 = __importDefault(require("fs"));
const _types_1 = require("../@types");
const utils_1 = require("../utils");
/**
 * Function to upload project code with a file attachment.
 * @param {string} projectId - Encrypted project ID.
 * @param {string} token - Authorization token.
 * @param {string} filePath - Path to the file to be uploaded.
 */
function uploadProjectCode(projectId, token, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            const formData = new form_data_1.default();
            formData.append('file', fs_1.default.createReadStream(filePath));
            const response = yield axios_1.default.put(`${utils_1.SERVER_URL}/v/p/${projectId}/code`, formData, {
                headers: Object.assign(Object.assign({}, formData.getHeaders()), { Authorization: token }),
            });
            console.log('file upload success');
            return {
                status: _types_1.LogStatus.SUCCESS,
                code: _types_1.StatusCode.OK,
                action: _types_1.LogAction.UPLOAD_PROJECT_CODE,
                message: 'File upload success.',
                data: response.data,
            };
        }
        catch (error) {
            console.error('Error uploading project code:', error.response);
            return {
                status: _types_1.LogStatus.FAIL,
                code: ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) || 500,
                message: ((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || 'Internal server error.',
            };
        }
    });
}
