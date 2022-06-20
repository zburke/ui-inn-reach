import React from 'react';
import {
  cloneDeep,
} from 'lodash';
import { screen, act } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { createMemoryHistory } from 'history';
import { translationsProperties } from '../../../../test/jest/helpers';
import PagingSlipTemplateRoute from './PagingSlipTemplateRoute';
import PagingSlipTemplateForm from '../../components/PagingSlipTemplate/PagingSlipTemplateForm';

jest.mock('../../components/PagingSlipTemplate/PagingSlipTemplateForm', () => {
  return jest.fn(() => <div>PagingSlipTemplateForm</div>);
});

jest.mock('@folio/stripes-components', () => ({
  ...jest.requireActual('@folio/stripes-components'),
  LoadingPane: jest.fn(() => <div>LoadingPane</div>),
}));

const servers = [
  {
    id: '1',
    name: 'testServerName1',
    localAgencies: [
      { code: '1qwer' },
      { code: 'qwer1' },
    ],
  },
  {
    id: '2',
    name: 'testServerName2',
    localAgencies: [
      { code: '2qwer' },
      { code: 'qwer2' },
    ],
  },
];

const payload = {
  description: '',
  template: '<div><br></div>',
};

const resourcesMock = {
  centralServerRecords: {
    records: [{ centralServers: servers }],
    isPending: false,
    hasLoaded: false,
  },
};

const mutatorMock = {
  selectedServerId: {
    replace: jest.fn(),
  },
  pagingSlipTemplate: {
    GET: jest.fn(() => Promise.resolve()),
    PUT: jest.fn(() => Promise.resolve()),
  },
};

const renderPagingSlipTemplateRoute = ({
  resources = resourcesMock,
  mutator = mutatorMock,
} = {}) => {
  return renderWithIntl(
    <PagingSlipTemplateRoute
      resources={resources}
      mutator={mutator}
      history={createMemoryHistory()}
    />,
    translationsProperties,
  );
};

describe('renderPagingSlipTemplateRoute component', () => {
  beforeEach(() => {
    PagingSlipTemplateForm.mockClear();
  });

  it('should be rendered', () => {
    const component = renderPagingSlipTemplateRoute();

    expect(component).toBeDefined();
  });

  it('should display loading', async () => {
    const newResources = cloneDeep(resourcesMock);

    newResources.centralServerRecords.isPending = true;
    await act(async () => { renderPagingSlipTemplateRoute({ resources: newResources }); });
    expect(screen.getByText('LoadingPane')).toBeVisible();
  });

  describe('handleServerChange function', () => {
    const newMutator = cloneDeep(mutatorMock);

    newMutator.pagingSlipTemplate.GET = jest.fn(() => Promise.resolve(payload));

    beforeEach(async () => {
      renderPagingSlipTemplateRoute({ mutator: newMutator });
      await act(async () => { await PagingSlipTemplateForm.mock.calls[0][0].onChangeServer(servers[0].name); });
    });

    it('should change the selected server in redux', () => {
      expect(mutatorMock.selectedServerId.replace).toHaveBeenCalledWith(servers[0].id);
    });

    it('should pass the selected server', () => {
      expect(PagingSlipTemplateForm.mock.calls[5][0].selectedServer).toEqual(servers[0]);
    });

    it('should produce correct initial values', () => {
      expect(PagingSlipTemplateForm.mock.calls[5][0].initialValues).toEqual({
        description: '',
        template: '<div><br></div>',
      });
    });
  });

  describe('handleSubmit', () => {
    it('should make a PUT request', async () => {
      const newMutator = cloneDeep(mutatorMock);

      newMutator.pagingSlipTemplate.GET = jest.fn(() => Promise.resolve(payload));
      await act(async () => { renderPagingSlipTemplateRoute({ mutator: newMutator }); });
      await act(async () => { PagingSlipTemplateForm.mock.calls[0][0].onChangeServer(servers[0].name); });
      await act(async () => { PagingSlipTemplateForm.mock.calls[5][0].onSubmit(payload); });
      expect(mutatorMock.pagingSlipTemplate.PUT).toHaveBeenCalledWith(payload);
    });
  });
});
