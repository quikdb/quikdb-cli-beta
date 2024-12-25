#!/usr/bin/env node
'use strict';
import { program } from './programs';
program.parse(process.argv);

// ===========================
// SDK Definitions
// ===========================
export { QuikDB } from '../src/controllers';
export {
  Field,
  CreateSchemaArgs,
  ResultBool,
  GetSchemaArgs,
  Schema,
  DeleteSchemaArgs,
  ListSchemasArgs,
  InsertDataArgs,
  GetRecordArgs,
  GetAllRecordsArgs,
  UpdateDataArgs,
  DeleteDataArgs,
  GetOwnerArgs,
  InitOwnerArgs,
  GetMetricsArgs,
  GetRecordSizesArgs,
  QueryByIndexArgs,
  SearchByIndexArgs,
  SearchByMultipleFieldsArgs,
  DBRecord,
  NoOfSchemaArgs,
  ResultRecords,
  ResultString,
  ResultStrings,
  ResultTuple,
  CanisterMethod,
} from '../src/@types';
export  { Principal } from '@dfinity/principal';
