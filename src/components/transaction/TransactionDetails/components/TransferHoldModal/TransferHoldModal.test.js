import React from 'react';
import { act } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import {
  MultiColumnList,
} from '@folio/stripes-components';
import TransferHoldModal from './TransferHoldModal';
import { translationsProperties } from '../../../../../../test/jest/helpers';

jest.mock('@folio/stripes-components', () => ({
  ...jest.requireActual('@folio/stripes-components'),
  Loading: jest.fn(() => <div>Loading</div>),
  MultiColumnList: jest.fn(() => <div>MultiColumnList</div>),
}));

const holdingsMock = [{ id: '111' }, { id: '222' }];
const itemsMock = [
  { id: '333', status: { name: 'any status' } },
  { id: '444', status: { name: 'Available' } },
  { id: '555', status: { name: '' } },
];
const requestsMock = [{ itemId: '444' }];

const mutatorMock = {
  holdings: {
    GET: jest.fn(() => Promise.resolve(holdingsMock)),
    reset: jest.fn(),
  },
  items: {
    GET: jest.fn(() => Promise.resolve(itemsMock)),
    reset: jest.fn(),
  },
  requests: {
    GET: jest.fn(() => Promise.resolve(requestsMock)),
    reset: jest.fn(),
  },
};

const history = createMemoryHistory();

const renderTransferHoldModal = ({
  title = 'Dune',
  instanceId = '123',
  skippedItemId = '555',
  mutator = mutatorMock,
  onClose,
  onRowClick,
} = {}) => {
  return renderWithIntl(
    <Router history={history}>
      <TransferHoldModal
        title={title}
        instanceId={instanceId}
        skippedItemId={skippedItemId}
        mutator={mutator}
        onClose={onClose}
        onRowClick={onRowClick}
      />
    </Router>,
    translationsProperties,
  );
};

describe('TransferHoldModal', () => {
  const onClose = jest.fn();
  const onRowClick = jest.fn();

  const commonProps = {
    onClose,
    onRowClick,
  };
  let container;

  beforeEach(async () => {
    await act(async () => { container = renderTransferHoldModal(commonProps).container; });
  });

  it('should be rendered', async () => {
    expect(container).toBeVisible();
  });

  it('should fetch holdings', () => {
    expect(mutatorMock.holdings.GET).toHaveBeenCalledWith({
      params: {
        query: 'instanceId==123',
      },
    });
  });

  it('should fetch items', () => {
    expect(mutatorMock.items.GET).toHaveBeenCalledWith({
      params: {
        limit: 1000,
        query: 'holdingsRecordId==111 or holdingsRecordId==222',
      },
    });
  });

  it('should fetch requests', () => {
    expect(mutatorMock.requests.GET).toHaveBeenCalledWith({
      params: {
        limit: 1000,
        query: '(itemId==333 or itemId==444 or itemId==555) and (status="Open")',
      },
    });
  });

  it('should have a list with the corresponding data', () => {
    expect(MultiColumnList.mock.calls[2][0].contentData).toEqual([
      { id: '444', status: { name: 'Available' }, requestQueue: 1 },
      { id: '333', status: { name: 'any status' }, requestQueue: 0 },
    ]);
  });
});
