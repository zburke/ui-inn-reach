export const BIB_TRANSFORMATION_ROUTE = 'bib-transformation';

export const BIB_TRANSFORMATION_FIELDS = {
  CENTRAL_SERVER_ID: 'centralServerId',
  CONFIG_IS_ACTIVE: 'configIsActive',
  TABULAR_LIST: 'tabularList',
  MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS: 'modifiedFieldsForContributedRecords',
  RESOURCE_IDENTIFIER_TYPE_ID: 'resourceIdentifierTypeId',
  STRIP_PREFIX: 'stripPrefix',
  IGNORE_PREFIXES: 'ignorePrefixes',
  EXCLUDED_MARC_FIELDS: 'excludedMARCFields',
};

const {
  MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS,
  RESOURCE_IDENTIFIER_TYPE_ID,
} = BIB_TRANSFORMATION_FIELDS;

export const NEW_ROW_VALUES = {
  [RESOURCE_IDENTIFIER_TYPE_ID]: undefined,
};

export const DEFAULT_INITIAL_VALUES = {
  [MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS]: [
    NEW_ROW_VALUES,
  ],
};
