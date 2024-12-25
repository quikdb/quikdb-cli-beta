#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Principal = exports.CanisterMethod = exports.QuikDB = void 0;
const programs_1 = require("./programs");
programs_1.program.parse(process.argv);
// ===========================
// SDK Definitions
// ===========================
var controllers_1 = require("../src/controllers");
Object.defineProperty(exports, "QuikDB", { enumerable: true, get: function () { return controllers_1.QuikDB; } });
var _types_1 = require("../src/@types");
Object.defineProperty(exports, "CanisterMethod", { enumerable: true, get: function () { return _types_1.CanisterMethod; } });
var principal_1 = require("@dfinity/principal");
Object.defineProperty(exports, "Principal", { enumerable: true, get: function () { return principal_1.Principal; } });
