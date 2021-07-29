import {
  isEmpty,
} from 'lodash';
import {
  CONTRIBUTION_CRITERIA,
  NO_VALUE_OPTION_VALUE,
} from '../../../../constants';

const {
  CONTRIBUTE_BUT_SUPPRESS_ID,
  DO_NOT_CONTRIBUTE_ID,
  CONTRIBUTE_AS_SYSTEM_OWNED_ID,
} = CONTRIBUTION_CRITERIA;

export const getFolioLocations = (folioLocations) => {
  return folioLocations.map(({ id, name }) => ({
    label: name,
    value: id,
  }));
};

const getIsOptionDisabled = (values, stCode) => {
  return [
    values[CONTRIBUTE_BUT_SUPPRESS_ID],
    values[DO_NOT_CONTRIBUTE_ID],
    values[CONTRIBUTE_AS_SYSTEM_OWNED_ID],
  ].includes(stCode.id);
};

export const getStatisticalCodeOptions = (formatMessage, values, statisticalCodes = [], statisticalCodeTypes = []) => {
  return statisticalCodes.reduce((accum, stCode) => {
    const codeTypeName = statisticalCodeTypes.find(stCodeType => stCode.statisticalCodeTypeId === stCodeType.id)?.name;
    const label = `${codeTypeName}: ${stCode.code} - ${stCode.name}`;

    const noValueOption = {
      label: formatMessage({ id: 'ui-inn-reach.no-selection' }),
      value: NO_VALUE_OPTION_VALUE,
    };

    const option = {
      label,
      value: stCode.id,
      disabled: getIsOptionDisabled(values, stCode),
    };

    if (isEmpty(accum)) {
      accum.push(noValueOption);
    }

    accum.push(option);

    return accum;
  }, []);
};
