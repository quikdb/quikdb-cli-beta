export const idlFactory = ({ IDL }: any) => {
  const Record = IDL.Record({
    id: IDL.Text,
    fields: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
  });
  const Result = IDL.Variant({ ok: IDL.Bool, err: IDL.Text });
  const Field = IDL.Record({
    name: IDL.Text,
    unique: IDL.Bool,
    fieldType: IDL.Text,
  });
  const Result_1 = IDL.Variant({ ok: IDL.Vec(Record), err: IDL.Text });
  const Result_4 = IDL.Variant({
    ok: IDL.Tuple(IDL.Int, IDL.Int),
    err: IDL.Text,
  });
  const Result_3 = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
  const Result_2 = IDL.Variant({ ok: IDL.Vec(IDL.Text), err: IDL.Text });
  const Schema = IDL.Record({
    schemaName: IDL.Text,
    createdAt: IDL.Int,
    fields: IDL.Vec(Field),
    indexes: IDL.Vec(IDL.Text),
  });
  return IDL.Service({
    createRecordData: IDL.Func([IDL.Text, Record], [Result], []),
    createSchema: IDL.Func([IDL.Text, IDL.Vec(Field), IDL.Vec(IDL.Text)], [Result], []),
    deleteAllRecords: IDL.Func([IDL.Text], [Result], []),
    deleteRecord: IDL.Func([IDL.Text, IDL.Text], [Result], []),
    deleteRecordsByIndex: IDL.Func([IDL.Text, IDL.Text, IDL.Text], [Result], []),
    deleteSchema: IDL.Func([IDL.Text], [Result], []),
    getAllRecords: IDL.Func([IDL.Text], [Result_1], ['query']),
    getMetrics: IDL.Func([IDL.Text], [Result_4], []),
    getOwner: IDL.Func([], [IDL.Principal], ['query']),
    getRecord: IDL.Func([IDL.Text, IDL.Text], [Result_3], ['query']),
    getRecordSizes: IDL.Func([IDL.Text], [Result_2], []),
    getSchema: IDL.Func([IDL.Text], [IDL.Opt(Schema)], ['query']),
    initOwner: IDL.Func([], [IDL.Bool], []),
    listSchemas: IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    noOfSchema: IDL.Func([], [IDL.Int], []),
    searchByIndex: IDL.Func([IDL.Text, IDL.Text, IDL.Text], [Result_1], []),
    searchByMultipleFields: IDL.Func([IDL.Text, IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))], [Result_1], []),
    updateData: IDL.Func([IDL.Text, IDL.Text, IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))], [Result], []),
  });
};
export const init = ({ IDL }: any) => {
  return [];
};
