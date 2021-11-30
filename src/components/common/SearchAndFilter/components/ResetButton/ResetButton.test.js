import React from 'react';
import {
  renderWithIntl,
} from '@folio/stripes-data-transfer-components/test/jest/helpers';
import user from '@testing-library/user-event';

import ResetButton from './ResetButton';

const renderResetButton = (props = {}) => (renderWithIntl(
  <ResetButton
    {...props}
  />,
));

describe('ResetButton', () => {
  it('should call reset prop when button is pressed', () => {
    const reset = jest.fn();
    const { getByTestId } = renderResetButton({ reset });

    user.click(getByTestId('reset-button'));

    expect(reset).toHaveBeenCalled();
  });

  it('should be disabled when prop is truthy', () => {
    const reset = jest.fn();
    const { getByTestId } = renderResetButton({ reset, disabled: true });

    expect(getByTestId('reset-button').disabled).toBeTruthy();
  });
});
