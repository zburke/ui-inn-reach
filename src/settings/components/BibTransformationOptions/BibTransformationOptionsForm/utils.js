import {
  BIB_TRANSFORMATION_FIELDS,
} from '../../../../constants';

const {
  RESOURCE_IDENTIFIER_TYPE_ID,
} = BIB_TRANSFORMATION_FIELDS;

const getSelectedOptions = (tabularListValues) => {
  return tabularListValues.reduce((accum, value) => {
    if (value[RESOURCE_IDENTIFIER_TYPE_ID]) {
      accum.add(value[RESOURCE_IDENTIFIER_TYPE_ID]);
    }

    return accum;
  }, new Set());
};

export const getIdentifierTypeOptions = (identifierTypes, tabularListValues = []) => {
  const selectedOptions = getSelectedOptions(tabularListValues);

  return identifierTypes.map(({ id, name }) => ({
    label: name,
    value: id,
    disabled: selectedOptions.has(id),
  }));
};
