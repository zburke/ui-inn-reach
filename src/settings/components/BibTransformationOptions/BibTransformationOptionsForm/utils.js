import {
  FormattedMessage,
} from 'react-intl';
import {
  BIB_TRANSFORMATION_FIELDS,
} from '../../../../constants';

const {
  RESOURCE_IDENTIFIER_TYPE_ID,
  MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS,
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

export const validateIdentifierTypeFields = (_, allValues) => {
  const hasAtLeastOneIdentifierType = allValues[MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS].some(row => row[RESOURCE_IDENTIFIER_TYPE_ID]);

  if (!hasAtLeastOneIdentifierType) {
    return <FormattedMessage id="ui-inn-reach.validate.required" />;
  }

  return undefined;
};
