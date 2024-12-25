// src/@types/index.ts

import { Principal } from "@dfinity/principal";

/**
 * Represents a single field in a schema.
 */
export type Field = {
  name: string;
  fieldType: string;
};

/**
 * Represents a single record in the database.
 */
export type DBRecord = {
  id: string;
  fields: [string, string][];
};

/**
 * Represents the schema of the database.
 */
export type Schema = {
  schemaName: string;
  createdAt: number; // Time.now() in Motoko returns Int, mapped to number
  fields: Field[];
  indexes: string[];
};

// ===========================
// Result Variant Type Definitions
// ===========================

/**
 * Represents a generic result with a boolean success flag.
 */
export type ResultBool = { ok: boolean } | { err: string };

/**
 * Represents a result that returns an array of DBRecords on success.
 */
export type ResultRecords = { ok: DBRecord[] } | { err: string };

/**
 * Represents a result that returns an array of strings on success.
 */
export type ResultStrings = { ok: string[] } | { err: string };

/**
 * Represents a result that returns a single string on success.
 */
export type ResultString = { ok: string } | { err: string };

/**
 * Represents a result that returns a tuple of two numbers on success.
 */
export type ResultTuple = { ok: [number, number] } | { err: string };

/**
 * Represents a result that returns undefined on success.
 */
export type ResultUndefined = { ok: undefined } | { err: string };

// ===========================
// Function Argument Type Definitions
// ===========================

/**
 * Arguments for the `createSchema` function.
 * @param schemaName - The name of the schema to be created.
 * @param customFields - An array of fields defining the schema's structure.
 * @param userDefinedIndexes - An array of field names to be used as indexes.
 */
export type CreateSchemaArgs = [string, Field[], string[]];

/**
 * Arguments for the `deleteData` function.
 * @param schemaName - The name of the schema from which data will be deleted.
 * @param recordId - The ID of the record to be deleted.
 */
export type DeleteDataArgs = [string, string];

/**
 * Arguments for the `deleteSchema` function.
 * @param schemaName - The name of the schema to be deleted.
 */
export type DeleteSchemaArgs = [string];

/**
 * Arguments for the `getAllRecords` function.
 * @param schemaName - The name of the schema from which all records will be retrieved.
 */
export type GetAllRecordsArgs = [string];

/**
 * Arguments for the `updateData` function.
 * @param schemaName - The name of the schema containing the record to update.
 * @param recordId - The ID of the record to be updated.
 * @param updatedFields - An array of field name and new value pairs to update in the record.
 */
export type UpdateDataArgs = [string, string, [string, string][]];

/**
 * Arguments for the `initOwner` function.
 * @param principal - The principal to set as the owner of the canister.
 */
export type InitOwnerArgs = [Principal];

/**
 * Arguments for the `getMetrics` function.
 * @param schemaName - The name of the schema for which metrics are being requested.
 */
export type GetMetricsArgs = [string];

/**
 * Arguments for the `getRecordSizes` function.
 * @param schemaName - The name of the schema for which record sizes are being requested.
 */
export type GetRecordSizesArgs = [string];

/**
 * Arguments for the `queryByIndex` function.
 * @param schemaName - The name of the schema to query.
 * @param indexName - The name of the index to query by.
 * @param value - The value to query for in the specified index.
 */
export type QueryByIndexArgs = [string, string, string];

/**
 * Arguments for the `searchByIndex` function.
 * @param schemaName - The name of the schema to search.
 * @param indexName - The name of the index to search by.
 * @param value - The value to search for in the specified index.
 */
export type SearchByIndexArgs = [string, string, string];

/**
 * Arguments for the `searchByMultipleFields` function.
 * @param schemaName - The name of the schema to search.
 * @param filters - An array of field name and value pairs to filter the search.
 */
export type SearchByMultipleFieldsArgs = [string, [string, string][]];

/**
 * Arguments for the `getOwner` function.
 * This function does not require any arguments.
 */
export type GetOwnerArgs = [];

/**
 * Arguments for the `listSchemas` function.
 * This function does not require any arguments.
 */
export type ListSchemasArgs = [];

/**
 * Arguments for the `noOfSchema` function.
 * This function does not require any arguments.
 */
export type NoOfSchemaArgs = [];

/**
 * Arguments for the `getSchema` function.
 * @param schemaName - The name of the schema to retrieve.
 */
export type GetSchemaArgs = [string];

/**
 * Arguments for the `insertData` function.
 * @param schemaName - The name of the schema into which data will be inserted.
 * @param record - The record data to be inserted.
 */
export type InsertDataArgs = [string, DBRecord];

/**
 * Arguments for the `getRecord` function.
 * @param schemaName - The name of the schema from which to retrieve the record.
 * @param recordId - The ID of the record to retrieve.
 */
export type GetRecordArgs = [string, string];

// src/@types/index.ts

/**
 * Enum representing all available canister method names.
 */
export enum CanisterMethod {
  CreateSchema = 'createSchema',
  DeleteData = 'deleteData',
  DeleteSchema = 'deleteSchema',
  GetAllRecords = 'getAllRecords',
  UpdateData = 'updateData',
  InitOwner = 'initOwner',
  GetMetrics = 'getMetrics',
  GetRecordSizes = 'getRecordSizes',
  QueryByIndex = 'queryByIndex',
  SearchByIndex = 'searchByIndex',
  SearchByMultipleFields = 'searchByMultipleFields',
  GetOwner = 'getOwner',
  ListSchemas = 'listSchemas',
  NoOfSchema = 'noOfSchema',
  GetSchema = 'getSchema',
  InsertData = 'insertData',
  GetRecord = 'getRecord',
}
