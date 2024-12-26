"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanisterMethod = void 0;
// src/@types/index.ts
/**
 * Enum representing all available canister method names.
 */
var CanisterMethod;
(function (CanisterMethod) {
    CanisterMethod["CreateSchema"] = "createSchema";
    CanisterMethod["DeleteData"] = "deleteData";
    CanisterMethod["DeleteSchema"] = "deleteSchema";
    CanisterMethod["GetAllRecords"] = "getAllRecords";
    CanisterMethod["UpdateData"] = "updateData";
    CanisterMethod["InitOwner"] = "initOwner";
    CanisterMethod["GetMetrics"] = "getMetrics";
    CanisterMethod["GetRecordSizes"] = "getRecordSizes";
    CanisterMethod["QueryByIndex"] = "queryByIndex";
    CanisterMethod["SearchByIndex"] = "searchByIndex";
    CanisterMethod["SearchByMultipleFields"] = "searchByMultipleFields";
    CanisterMethod["GetOwner"] = "getOwner";
    CanisterMethod["ListSchemas"] = "listSchemas";
    CanisterMethod["NoOfSchema"] = "noOfSchema";
    CanisterMethod["GetSchema"] = "getSchema";
    CanisterMethod["InsertData"] = "insertData";
    CanisterMethod["GetRecord"] = "getRecord";
})(CanisterMethod || (exports.CanisterMethod = CanisterMethod = {}));
