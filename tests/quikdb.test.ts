import { QuikDB } from '../src/controllers';
import {
  Field,
  CreateSchemaArgs,
  ResultBool,
  GetSchemaArgs,
  Schema,
  DeleteSchemaArgs,
  ListSchemasArgs,
  CreateRecordDataArgs,
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
import { Principal } from '@dfinity/principal';

describe('QuikDB Class Integration Tests', () => {
  let quikDB: QuikDB;
  const schemaName = 'NewSchema';
  const fields: Field[] = [
    { name: 'username', unique: false, fieldType: 'Text' },
    { name: 'age', unique: false, fieldType: 'Int' },
    { name: 'email', unique: true, fieldType: 'Int' },
  ];
  const indexes: string[] = ['username'];
  const recordId = 'record1';
  const recordId2 = 'record2';

  beforeEach(async () => {
    quikDB = new QuikDB();
    await quikDB.init();
    const typeDefinition = quikDB.getTypeDeclaration();

    console.log('Type Declaration:', typeDefinition);
  });

  afterAll(async () => {
    const deleteSchemaArgs: DeleteSchemaArgs = [schemaName];
  });

  // ===========================
  // Initialization Tests
  // ===========================
  describe('Initialization', () => {
    it('should initialize correctly with valid configuration and connect to the canister', async () => {
      expect(quikDB.getAccessToken()).toBeDefined();
      expect(quikDB.getUrl()).toBe('http://127.0.0.1:4943/');
      expect(quikDB.getCanisterId()).toBeDefined();

      expect(quikDB['agent'].host.href).toBe('http://127.0.0.1:4943/');

      expect(quikDB.getTypeDeclaration()).toBeDefined();
    });
  });

  // ===========================
  // Canister Method Tests: Owner
  // ===========================
  describe('Initialization', () => {
    it('should initialize and retrieve the owner Principal', async () => {
      const initOwnerResult = await quikDB.callCanisterMethod(CanisterMethod.InitOwner, []);
      console.log({ initOwnerResult });

      const getOwnerResult = await quikDB.callCanisterMethod(CanisterMethod.GetOwner, []);

      expect(getOwnerResult).toBeDefined();

      if (getOwnerResult instanceof Principal) {
        const ownerPrincipalId = getOwnerResult.toText();
        console.log({ ownerPrincipalId });

        expect(ownerPrincipalId).toBeTruthy();

        expect(ownerPrincipalId).toBe('2vxsx-fae');
      } else {
        console.error('Expected a Principal instance but received:', getOwnerResult);
        fail('getOwnerResult is not a Principal instance');
      }
    });
  });

  // ===========================
  // Canister Method Tests: Schema
  // ===========================
  describe('Canister Methods: Schema', () => {
    it('should create a new schema successfully', async () => {
      const args: CreateSchemaArgs = [schemaName, fields, indexes];
      const result: ResultBool = await quikDB.callCanisterMethod(CanisterMethod.CreateSchema, args);

      console.log('createSchema Result:', result);
      expect(result).toHaveProperty('ok', true);

      const getSchemaArgs: GetSchemaArgs = [schemaName];
      const schemaResult: Schema[] = await quikDB.callCanisterMethod(CanisterMethod.GetSchema, getSchemaArgs);

      console.log('getSchema Result:', schemaResult[0]);
      expect(schemaResult[0]).toBeDefined();
      if (schemaResult[0]) {
        expect(schemaResult[0].schemaName).toBe(schemaName);
        // expect(schemaResult[0].fields).toEqual(fields);
        expect(schemaResult[0].indexes).toEqual(indexes);
      }
    });

    it('should list all schemas successfully', async () => {
      const listSchemaArgs: ListSchemasArgs = [];
      const schemaResult: string[] = await quikDB.callCanisterMethod(CanisterMethod.ListSchemas, listSchemaArgs);

      console.log('listSchemas Result:', schemaResult);
      expect(Array.isArray(schemaResult)).toBe(true);
      expect(schemaResult.length).toBeGreaterThan(0);
      expect(schemaResult).toContain(schemaName);
    });

    it('should return error when creating a schema that already exists', async () => {
      const args: CreateSchemaArgs = [schemaName, fields, indexes];
      const result: ResultBool = await quikDB.callCanisterMethod(CanisterMethod.CreateSchema, args);

      console.log('createSchema duplicate Result:', result);
      expect(result).toHaveProperty('err', 'A schema with this name already exists!');
    });

    it('should delete schema successfully', async () => {
      const deleteSchemaArgs: DeleteSchemaArgs = [schemaName];
      const deleteSchemaResult: ResultBool = await quikDB.callCanisterMethod(
        CanisterMethod.DeleteSchema,
        deleteSchemaArgs
      );

      console.log('deleteSchema Result:', deleteSchemaResult);
      expect(deleteSchemaResult).toHaveProperty('ok', true);

      const getSchemaArgs: GetSchemaArgs = [schemaName];
      const schemaResult: Schema[] = await quikDB.callCanisterMethod(CanisterMethod.GetSchema, getSchemaArgs);

      console.log('getSchema after deletion Result:', schemaResult);
      expect(schemaResult[0]).toBeUndefined();
    });
  });

  // ===========================
  // Canister Method Tests: Records
  // ===========================
  describe('Canister Methods: Records', () => {
    beforeAll(async () => {
      const createSchemaArgs: CreateSchemaArgs = [schemaName, fields, indexes];
      await quikDB.callCanisterMethod(CanisterMethod.CreateSchema, createSchemaArgs);
    });

    afterAll(async () => {
      const deleteSchemaArgs: DeleteSchemaArgs = [schemaName];
      await quikDB.callCanisterMethod(CanisterMethod.DeleteSchema, deleteSchemaArgs);
    });

    it('should insert data successfully', async () => {
      const record: DBRecord = {
        id: recordId,
        fields: [
          ['username', 'testuser'],
          ['age', '30'],
          ['email', 'test2@gmail.com'],
        ],
      };

      const CreateRecordDataArgs: CreateRecordDataArgs = [schemaName, record];
      const insertResult: ResultBool = await quikDB.callCanisterMethod(
        CanisterMethod.CreateRecordData,
        CreateRecordDataArgs
      );

      console.log('insertData Result:', insertResult);
      expect(insertResult).toHaveProperty('ok', true);
    });

    it('should retrieve a record successfully', async () => {
      const getRecordArgs: GetRecordArgs = [schemaName, recordId];
      const recordResult: ResultString = await quikDB.callCanisterMethod(CanisterMethod.GetRecord, getRecordArgs);

      console.log('getRecord Result:', recordResult);
      expect('ok' in recordResult).toBe(true);
      if ('ok' in recordResult) {
        expect(typeof recordResult.ok).toBe('string');
        expect(recordResult.ok).toContain(`Record ID: ${recordId}`);
        expect(recordResult.ok).toContain('Size:');
        expect(recordResult.ok).toContain('Fields:');
      }
    });

    it('should retrieve all records successfully', async () => {
      const getAllRecordsArgs: GetAllRecordsArgs = [schemaName];
      const allRecordsResult: ResultRecords = await quikDB.callCanisterMethod(
        CanisterMethod.GetAllRecords,
        getAllRecordsArgs
      );

      console.log('getAllRecords Result:', allRecordsResult);
      expect('ok' in allRecordsResult).toBe(true);
      if ('ok' in allRecordsResult) {
        expect(Array.isArray(allRecordsResult.ok)).toBe(true);
        expect(allRecordsResult.ok.length).toBeGreaterThan(0);
        const record = allRecordsResult.ok.find((r) => r.id === recordId);
        expect(record).toBeDefined();
        expect(record?.id).toBe(recordId);
      }
    });

    it('should update data successfully', async () => {
      const updatedFields: [string, string][] = [['age', '31']];

      const updateDataArgs: UpdateDataArgs = [schemaName, recordId, updatedFields];
      const updateResult: ResultBool = await quikDB.callCanisterMethod(CanisterMethod.UpdateData, updateDataArgs);

      console.log('updateData Result:', updateResult);
      expect(updateResult).toHaveProperty('ok', true);

      const getRecordArgs: GetRecordArgs = [schemaName, recordId];
      const updatedRecordResult: ResultString = await quikDB.callCanisterMethod(
        CanisterMethod.GetRecord,
        getRecordArgs
      );

      console.log('getRecord after update Result:', updatedRecordResult);
      expect('ok' in updatedRecordResult).toBe(true);
      if ('ok' in updatedRecordResult) {
        expect(updatedRecordResult.ok).toContain('age: 31');
      }
    });

    it('should throw when inserting a record that already exists', async () => {
      const record: DBRecord = {
        id: recordId,
        fields: [
          ['username', 'testuser'],
          ['age', '32'],
          ['email', 'test2@gmail.com'],
        ],
      };

      const CreateRecordDataArgs: CreateRecordDataArgs = [schemaName, record];
      const insertResult: ResultBool = await quikDB.callCanisterMethod(
        CanisterMethod.CreateRecordData,
        CreateRecordDataArgs
      );

      console.log('insertData duplicate Result (overwrite):', insertResult);
      expect(insertResult).toHaveProperty('err', `Record with ID '${recordId}' already exists. Insertion aborted.`);
    });

    it('should throw when inserting an already existing value for unique field in a new record', async () => {
      const record: DBRecord = {
        id: recordId2,
        fields: [
          ['username', 'testuser'],
          ['age', '32'],
          ['email', 'test2@gmail.com'],
        ],
      };

      const CreateRecordDataArgs: CreateRecordDataArgs = [schemaName, record];
      const insertResult: ResultBool = await quikDB.callCanisterMethod(
        CanisterMethod.CreateRecordData,
        CreateRecordDataArgs
      );

      console.log('insertData existing unique:', insertResult);
      const getAllRecordsArgs: GetAllRecordsArgs = [schemaName];
      const allRecordsResult: ResultRecords = await quikDB.callCanisterMethod(
        CanisterMethod.GetAllRecords,
        getAllRecordsArgs
      );

      console.log('getAllRecords Result:', JSON.stringify(allRecordsResult));
      expect(insertResult).toHaveProperty('err', `Duplicate value found for unique field 'email'.`);
    });

    it('should delete record successfully', async () => {
      const deleteDataArgs: DeleteDataArgs = [schemaName, recordId];
      const deleteDataResult: ResultBool = await quikDB.callCanisterMethod(CanisterMethod.DeleteRecord, deleteDataArgs);

      console.log('deleteData Result:', deleteDataResult);
      expect(deleteDataResult).toHaveProperty('ok', true);

      const getRecordArgs: GetRecordArgs = [schemaName, recordId];
      const recordResult: ResultString = await quikDB.callCanisterMethod(CanisterMethod.GetRecord, getRecordArgs);

      console.log('getRecord after deletion Result:', recordResult);
      expect('err' in recordResult).toBe(true);
      if ('err' in recordResult) {
        expect(recordResult.err).toBe('Record not found!');
      }
    });
  });

  // ===========================
  // Canister Method Tests: Metrics
  // ===========================
  describe('Canister Methods: Metrics', () => {
    beforeAll(async () => {
      const createSchemaArgs: CreateSchemaArgs = [schemaName, fields, indexes];
      await quikDB.callCanisterMethod(CanisterMethod.CreateSchema, createSchemaArgs);

      const record1: DBRecord = {
        id: 'user1',
        fields: [
          ['email', 'user1@example.com'],
          ['name', 'active'],
          ['age', '30'],
        ],
      };

      await quikDB.callCanisterMethod(CanisterMethod.CreateRecordData, [schemaName, record1]);

      const record2: DBRecord = {
        id: 'user2',
        fields: [
          ['email', 'user2@example.com'],
          ['name', 'active'],
          ['age', '30'],
        ],
      };

      await quikDB.callCanisterMethod(CanisterMethod.CreateRecordData, [schemaName, record2]);
    }, 10000);

    afterAll(async () => {
      const deleteSchemaArgs: DeleteSchemaArgs = [schemaName];
      await quikDB.callCanisterMethod(CanisterMethod.DeleteSchema, deleteSchemaArgs);
    });

    it('should retrieve metrics successfully', async () => {
      const getMetricsArgs: GetMetricsArgs = [schemaName];
      const metricsResult: ResultTuple = await quikDB.callCanisterMethod(CanisterMethod.GetMetrics, getMetricsArgs);

      console.log('getMetrics Result:', metricsResult);
      expect('ok' in metricsResult).toBe(true);
      if ('ok' in metricsResult) {
        expect(Array.isArray(metricsResult.ok)).toBe(true);
        expect(metricsResult.ok.length).toBe(2);
        expect(typeof metricsResult.ok[0]).toBe('bigint');
        expect(typeof metricsResult.ok[1]).toBe('bigint');
      }
    });

    it('should retrieve record sizes successfully', async () => {
      const getRecordSizesArgs: GetRecordSizesArgs = [schemaName];
      const recordSizesResult: ResultStrings = await quikDB.callCanisterMethod(CanisterMethod.GetRecordSizes, getRecordSizesArgs);

      console.log('getRecordSizes Result:', recordSizesResult);
      expect('ok' in recordSizesResult).toBe(true);
      if ('ok' in recordSizesResult) {
        expect(Array.isArray(recordSizesResult.ok)).toBe(true);
        expect(recordSizesResult.ok.length).toBeGreaterThan(0);
        expect(typeof recordSizesResult.ok[0]).toBe('string');
      }
    });
  });

  // ===========================
  // Canister Method Tests: Query
  // ===========================
  describe('Canister Methods: Query', () => {
    beforeAll(async () => {
      const fields: Field[] = [
        { name: 'email', unique: false, fieldType: 'Text' },
        { name: 'status', unique: false, fieldType: 'Text' },
      ];
      const indexes: string[] = ['email', 'status'];

      const createSchemaArgs: CreateSchemaArgs = [schemaName, fields, indexes];
      await quikDB.callCanisterMethod(CanisterMethod.CreateSchema, createSchemaArgs);

      const record1: DBRecord = {
        id: 'user1',
        fields: [
          ['email', 'user1@example.com'],
          ['status', 'active'],
          ['creation_timestamp', Date.now().toFixed()],
          ['update_timestamp', Date.now().toFixed()],
        ],
      };

      const record2: DBRecord = {
        id: 'user2',
        fields: [
          ['email', 'user2@example.com'],
          ['status', 'inactive']
        ],
      };

      await quikDB.callCanisterMethod(CanisterMethod.CreateRecordData, [schemaName, record1]);
      await quikDB.callCanisterMethod(CanisterMethod.CreateRecordData, [schemaName, record2]);
    }, 10000);

    afterAll(async () => {
      const deleteSchemaArgs: DeleteSchemaArgs = [schemaName];
      await quikDB.callCanisterMethod(CanisterMethod.DeleteSchema, deleteSchemaArgs);
    });

    it('should search by index successfully', async () => {
      const searchByIndexArgs: SearchByIndexArgs = [schemaName, 'status', 'active'];
      const searchResult: ResultRecords = await quikDB.callCanisterMethod(CanisterMethod.SearchByIndex, searchByIndexArgs);

      console.log('searchByIndex Result:', searchResult);
      expect('ok' in searchResult || 'err' in searchResult).toBe(true);
      if ('ok' in searchResult) {
        expect(Array.isArray(searchResult.ok)).toBe(true);
        expect(searchResult.ok.length).toBe(1);
        expect(searchResult.ok[0].id).toBe('user1');
      }
    });

    it('should search by multiple fields successfully', async () => {
      const searchByMultipleFieldsArgs: SearchByMultipleFieldsArgs = [
        schemaName,
        [
          ['email', 'user2@example.com'],
          ['status', 'inactive'],
        ],
      ];
      const searchMultipleResult: ResultRecords = await quikDB.callCanisterMethod(
        CanisterMethod.SearchByMultipleFields,
        searchByMultipleFieldsArgs
      );

      console.log('searchByMultipleFields Result:', searchMultipleResult);
      expect('ok' in searchMultipleResult || 'err' in searchMultipleResult).toBe(true);
      if ('ok' in searchMultipleResult) {
        expect(Array.isArray(searchMultipleResult.ok)).toBe(true);
        expect(searchMultipleResult.ok.length).toBe(1);
        expect(searchMultipleResult.ok[0].id).toBe('user2');
      }
    });
  });

  // ===========================
  // Canister Method Tests: Miscellaneous
  // ===========================
  describe('Canister Methods: Miscellaneous', () => {
    beforeAll(async () => {
      const fields: Field[] = [
        { name: 'email', unique: false, fieldType: 'Text' },
        { name: 'status', unique: false, fieldType: 'Text' },
      ];
      const indexes: string[] = ['email', 'status'];

      const createSchemaArgs: CreateSchemaArgs = [schemaName, fields, indexes];
      await quikDB.callCanisterMethod(CanisterMethod.CreateSchema, createSchemaArgs);
    }, 10000);

    afterAll(async () => {
      const deleteSchemaArgs: DeleteSchemaArgs = [schemaName];
      await quikDB.callCanisterMethod(CanisterMethod.DeleteSchema, deleteSchemaArgs);
    });
    it('should return the number of schemas successfully', async () => {
      const noOfSchemaArgs: NoOfSchemaArgs = [];
      const noOfSchemaResult: number | ResultBool = await quikDB.callCanisterMethod(CanisterMethod.NoOfSchema, noOfSchemaArgs);

      console.log('noOfSchema Result:', Number(noOfSchemaResult));
      if (typeof noOfSchemaResult === 'bigint') {
        expect(noOfSchemaResult).toBeGreaterThan(0);
      } else {
        expect(noOfSchemaResult).toHaveProperty('err');
      }
    });
  });
});
