import React from 'react';

import {
  renderWithIntl,
} from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { useStripes } from '@folio/stripes/core';
import { ControlledVocab } from '@folio/stripes/smart-components';

import InnreachLocations from './InnreachLocations';

const renderInnreachLocations = ({ stripes }) => renderWithIntl(
  <InnreachLocations
    stripes={stripes}
  />
);

describe('Given InnreachLocations', () => {
  let stripes;

  beforeEach(() => {
    ControlledVocab.mockClear();

    stripes = useStripes();
  });

  it('should render ConnectedControlledVocab component', async () => {
    renderInnreachLocations({ stripes });

    expect(ControlledVocab).toHaveBeenCalled();
  });

  it('should render label', async () => {
    const { getByText } = renderInnreachLocations({ stripes });

    expect(getByText('ui-inn-reach.settings.central-server.locations')).toBeDefined();
  });
});
