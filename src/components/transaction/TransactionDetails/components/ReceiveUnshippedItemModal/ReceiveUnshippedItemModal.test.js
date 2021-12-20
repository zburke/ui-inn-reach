import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import userEvent from '@testing-library/user-event';
import ReceiveUnshippedItemModal from './ReceiveUnshippedItemModal';
import { translationsProperties } from '../../../../../../test/jest/helpers';

const history = createMemoryHistory();

const renderReceiveUnshippedItemModal = ({
  onSubmit,
  onTriggerModal,
} = {}) => {
  return renderWithIntl(
    <Router history={history}>
      <ReceiveUnshippedItemModal
        intl={{ formatMessage: jest.fn() }}
        onSubmit={onSubmit}
        onTriggerModal={onTriggerModal}
      />
    </Router>,
    translationsProperties,
  );
};

describe('ReceiveUnshippedItemModal', () => {
  const onSubmit = jest.fn();
  const onTriggerModal = jest.fn();

  const commonProps = {
    onSubmit,
    onTriggerModal,
  };

  it('should be rendered', () => {
    const { container } = renderReceiveUnshippedItemModal(commonProps);

    expect(container).toBeVisible();
  });

  describe('submit', () => {
    it('should be called by hitting enter', () => {
      renderReceiveUnshippedItemModal(commonProps);
      userEvent.type(screen.getByTestId('itemBarcode'), '12345{enter}');
      expect(onSubmit).toBeCalled();
    });

    it('should be called by pressing submit', () => {
      renderReceiveUnshippedItemModal(commonProps);
      userEvent.type(screen.getByTestId('itemBarcode'), '12345');
      userEvent.click(screen.getByRole('button', { name: 'Submit' }));
      expect(onSubmit).toBeCalled();
    });
  });
});
