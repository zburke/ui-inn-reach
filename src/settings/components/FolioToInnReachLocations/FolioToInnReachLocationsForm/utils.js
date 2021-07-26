import {
  NO_VALUE_OPTION,
} from '../../../../constants';

export const getInnReachLocationOptions = (innReachLocations) => {
  return innReachLocations.reduce((accum, { id, code }) => {
    const option = {
      id,
      value: code,
      label: code,
    };

    accum.push(option);

    return accum;
  }, [NO_VALUE_OPTION]);
};
