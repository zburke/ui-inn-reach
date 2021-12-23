import { screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import ComponentToPrint from './ComponentToPrint';
import { translationsProperties } from '../../../../test/jest/helpers';
import { AUGMENTED_BARCODE_TEMPLATE } from '../../../constants';

const dataSourceMock = {
  'item.title': 'God Emperor of Dune: Sianoq!',
  'transaction.shippedItemBarcode': '5465657848',
  'transaction.itemAgencyCode': 'moag1',
  'transaction.folioItemBarcode': '5465657848moag1',
  'item.barcodeImage': '5465657848',
};

const renderComponentToPrint = ({
  dataSource = dataSourceMock,
  template = AUGMENTED_BARCODE_TEMPLATE,
} = {}) => {
  return renderWithIntl(
    <ComponentToPrint
      dataSource={dataSource}
      template={template}
    />,
    translationsProperties,
  );
};

describe('ComponentToPrint', () => {
  it('should be rendered', () => {
    const { container } = renderComponentToPrint();

    expect(container).toBeVisible();
  });

  it('should display the item title', () => {
    renderComponentToPrint();
    expect(screen.getByText('God Emperor of Dune: Sianoq!')).toBeVisible();
  });

  it('should display the original barcode', () => {
    renderComponentToPrint();
    expect(screen.getByText('Original Barcode: 5465657848')).toBeVisible();
  });

  it('should display the agency code', () => {
    renderComponentToPrint();
    expect(screen.getByText('Item Agency: moag1')).toBeVisible();
  });

  it('should display the new barcode', () => {
    renderComponentToPrint();
    expect(screen.getByText('New Barcode: 5465657848moag1')).toBeVisible();
  });

  it('should display barcode', () => {
    renderComponentToPrint();
    expect(screen.getByText('5465657848')).toBeVisible();
  });
});
