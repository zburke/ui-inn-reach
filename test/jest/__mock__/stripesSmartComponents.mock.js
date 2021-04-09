import React from 'react';

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  ControlledVocab: jest.fn(({
    label,
  }) => (
    <>
      <span>{label}</span>
    </>
  )),
  Settings: jest.fn(({
    pages,
    paneTitle,
  }) => (
    <>
      <span>{paneTitle}</span>
      <span>{pages[0].route}</span>
      <span>{pages[0].label}</span>
    </>
  )),
}), { virtual: true });
