"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVER_URL = exports.isProd = exports.production = void 0;
exports.production = false; // for logging
exports.isProd = true;
exports.SERVER_URL = exports.isProd ? 'https://quikdb-core-beta.onrender.com' : 'http://localhost:4567';
