import { screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import ConfirmStatusModal from './ConfirmStatusModal';
import { translationsProperties } from '../../../../../test/jest/helpers';

const renderConfirmStatusModal = ({
  open,
  showPrintButton,
  isPrintable,
  slipTemplate = '',
  slipData = {},
  message = [],
  onAfterPrint,
  onClose,
} = {}) => {
  return renderWithIntl(
    <ConfirmStatusModal
      open={open}
      label="modal label"
      showPrintButton={showPrintButton}
      isPrintable={isPrintable}
      slipTemplate={slipTemplate}
      slipData={slipData}
      message={message}
      onAfterPrint={onAfterPrint}
      onClose={onClose}
    />,
    translationsProperties,
  );
};

describe('ConfirmStatusModal', () => {
  const onAfterPrint = jest.fn();
  const onClose = jest.fn();
  const commonProps = {
    onAfterPrint,
    onClose,
  };

  it('should be rendered', () => {
    const { container } = renderConfirmStatusModal(commonProps);

    expect(container).toBeVisible();
  });

  it('should display a simple button', () => {
    renderConfirmStatusModal(commonProps);
    expect(screen.getByTestId('close-button')).toBeVisible();
  });

  it('should display the print button', () => {
    renderConfirmStatusModal({
      ...commonProps,
      isPrintable: true,
      showPrintButton: true,
    });
    expect(screen.getByTestId('print-button')).toBeVisible();
  });
});
