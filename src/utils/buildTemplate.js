import {
  escape,
} from 'lodash';

const escapeValue = (val) => {
  if (typeof val === 'string' && val.startsWith('<Barcode>') && val.endsWith('</Barcode>')) {
    return val;
  }

  return escape(val);
};

export function buildTemplate(str) {
  return o => {
    return str.replace(/{{([^{}]*)}}/g, (a, b) => {
      const r = o[b];

      return typeof r === 'string' || typeof r === 'number' ? escapeValue(r) : '';
    });
  };
}
