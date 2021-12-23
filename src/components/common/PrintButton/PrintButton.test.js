import { screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import PrintButton from './PrintButton';
import { translationsProperties } from '../../../../test/jest/helpers';
import ComponentToPrint from '../ComponentToPrint';

jest.mock('../ComponentToPrint', () => jest.fn(() => <div>ComponentToPrint</div>));

const dataSourceMock = {
  'item.allContributors': 'INN-Reach author',
  'item.barcode': '5465657848',
};

const templateMock = '<p>template</p>';

const renderPrintButton = ({
  dataSource = dataSourceMock,
  template = templateMock,
  onBeforePrint,
  onAfterPrint,
} = {}) => {
  return renderWithIntl(
    <PrintButton
      data-testid="print-button"
      dataSource={dataSource}
      template={template}
      onBeforePrint={onBeforePrint}
      onAfterPrint={onAfterPrint}
    >
      Close
    </PrintButton>,
    translationsProperties,
  );
};

describe('PrintButton', () => {
  const onBeforePrint = jest.fn();
  const onAfterPrint = jest.fn();
  const commonProps = {
    onBeforePrint,
    onAfterPrint,
  };

  beforeEach(() => {
    ComponentToPrint.mockClear();
  });

  it('should be rendered', () => {
    const { container } = renderPrintButton(commonProps);

    expect(container).toBeVisible();
  });

  it('should show Close button', () => {
    renderPrintButton(commonProps);
    expect(screen.getByText('Close')).toBeVisible();
  });

  it('should pass template to ComponentToPrint', () => {
    renderPrintButton(commonProps);
    expect(ComponentToPrint.mock.calls[0][0].template).toEqual(templateMock);
  });

  it('should pass template data to ComponentToPrint', () => {
    renderPrintButton(commonProps);
    expect(ComponentToPrint.mock.calls[0][0].dataSource).toEqual(dataSourceMock);
  });
});
