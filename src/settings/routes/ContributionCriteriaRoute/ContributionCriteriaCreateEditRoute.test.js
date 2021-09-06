import React from 'react';
import {
  cloneDeep,
  omit,
} from 'lodash';
import { createMemoryHistory } from 'history';
import { waitFor, screen, act } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { ConfirmationModal } from '@folio/stripes-components';

import { translationsProperties } from '../../../../test/jest/helpers';
import ContributionCriteriaCreateEditRoute from './ContributionCriteriaCreateEditRoute';
import ContributionCriteriaForm from '../../components/ContributionCriteria/ContributionCriteriaForm';
import { useCentralServers } from '../../../hooks';
import { CONTRIBUTION_CRITERIA } from '../../../constants';

const {
  LOCATIONS_IDS,
} = CONTRIBUTION_CRITERIA;

jest.mock('../../components/ContributionCriteria/ContributionCriteriaForm', () => {
  return jest.fn(() => <div>ContributionCriteriaForm</div>);
});

jest.mock('../../../hooks', () => ({
  ...jest.requireActual('../../../hooks'),
  useCentralServers: jest.fn().mockReturnValue({}),
}));

jest.mock('@folio/stripes-components', () => ({
  ConfirmationModal: jest.fn(() => 'ConfirmationModal'),
  LoadingPane: jest.fn(() => 'LoadingPane'),
}));

const locations = [
  {
    id: '99880669-07cc-4658-b213-e6200344d1c3',
    name: 'testLocation1',
  },
  {
    id: '0ac0ffe6-c3ee-4610-b15c-019bbaea5dbd',
    name: 'testLocation2',
  },
  {
    id: 'dfc42e20-7883-4c71-a3cf-f4c0aab1aedc',
    name: 'testLocation3',
  }
];

const statisticalCodesData = [
  {
    id: '7a82f404-07df-4e5e-8e8f-a15f3b6ddffa',
    statisticalCodeTypeId: '882a737a-27ce-4f0c-90fc-36b92c6046bf',
    code: 'testCode',
    name: 'testCodeName',
  }
];

const statisticalCodeTypesData = [
  {
    name: 'typeName',
    id: '882a737a-27ce-4f0c-90fc-36b92c6046bf',
  }
];

const servers = [
  {
    id: '1',
    name: 'testServerName1',
  },
  {
    id: '2',
    name: 'testServerName2',
  },
];

const contributionCriteria = {
  locationIds: [
    '99880669-07cc-4658-b213-e6200344d1c3',
    '0ac0ffe6-c3ee-4610-b15c-019bbaea5dbd',
    'dfc42e20-7883-4c71-a3cf-f4c0aab1aedc'
  ],
  contributeButSuppressId: '54a61ace-affc-4bf9-a9b9-d604b2d36250',
  doNotContributeId: '19e8ee99-2e6b-4e2d-96e6-402d9caf9efa',
  contributeAsSystemOwnedId: '73c8ba83-b80f-4287-a02d-79906d7864f1',
};

const serverOptions = [
  {
    id: '1',
    value: 'testServerName1',
    label: 'testServerName1',
  },
  {
    id: '2',
    value: 'testServerName2',
    label: 'testServerName2',
  },
];

const resourcesMock = {
  selectedServerId: servers[1].id,
  centralServerRecords: {
    records: servers,
    isPending: false,
    hasLoaded: false,
  },
  folioLocations: {
    records: [{ locations }],
  },
  statisticalCodeTypes: {
    records: [{ statisticalCodeTypes: statisticalCodeTypesData }],
  },
  statisticalCodes: {
    records: [{ statisticalCodes: statisticalCodesData }],
  },
};

const postMock = jest.fn(() => Promise.resolve());
const putMock = jest.fn(() => Promise.resolve());
const getMock = jest.fn(() => Promise.resolve());
const replaceMock = jest.fn();

const mutatorMock = {
  selectedServerId: {
    replace: replaceMock,
  },
  contributionCriteria: {
    GET: getMock,
    PUT: putMock,
    POST: postMock,
  },
};

const renderContributionCriteriaCreateEditRoute = ({
  resources = resourcesMock,
  mutator = mutatorMock,
  history,
} = {}) => {
  return renderWithIntl(
    <ContributionCriteriaCreateEditRoute
      history={history}
      mutator={mutator}
      resources={resources}
    />,
    translationsProperties,
  );
};

describe('ContributionCriteriaCreateEditRoute component', () => {
  const selectedServer = servers[1];
  const openModal = false;
  const isResetForm = false;
  const isPristine = false;
  const changePristineState = jest.fn();
  const changeFormResetState = jest.fn();
  const handleServerChange = jest.fn();
  const handleModalConfirm = jest.fn();
  const handleModalCancel = jest.fn();
  let history;

  beforeEach(() => {
    ConfirmationModal.mockClear();
    ContributionCriteriaForm.mockClear();
    history = createMemoryHistory();
    useCentralServers.mockClear().mockReturnValue({
      selectedServer,
      openModal,
      isResetForm,
      isPristine,
      serverOptions,
      changePristineState,
      changeFormResetState,
      handleServerChange,
      handleModalConfirm,
      handleModalCancel,
    });
  });

  it('should be rendered', async () => {
    let component;

    await waitFor(() => {
      component = renderContributionCriteriaCreateEditRoute({ history });
    });
    expect(component).toBeDefined();
  });

  it('should display loading', async () => {
    const newResources = cloneDeep(resourcesMock);

    newResources.centralServerRecords.isPending = true;
    await waitFor(() => {
      renderContributionCriteriaCreateEditRoute({ history, resources: newResources });
    });
    expect(screen.getByText('LoadingPane')).toBeVisible();
  });

  it('should call GET', async () => {
    await waitFor(() => {
      renderContributionCriteriaCreateEditRoute({ history });
    });
    expect(replaceMock).toHaveBeenCalled();
    expect(getMock).toHaveBeenCalled();
  });

  describe('submit', () => {
    const record = {
      ...contributionCriteria,
      locationIds: [
        { value: '99880669-07cc-4658-b213-e6200344d1c3' },
        { value: '0ac0ffe6-c3ee-4610-b15c-019bbaea5dbd' },
        { value: 'dfc42e20-7883-4c71-a3cf-f4c0aab1aedc' },
      ],
    };
    const finalRecord = contributionCriteria;

    it('should cause POST request', async () => {
      await act(async () => { await renderContributionCriteriaCreateEditRoute({ history }); });
      await act(async () => { await ContributionCriteriaForm.mock.calls[3][0].onSubmit(record); });
      expect(postMock).toHaveBeenCalledWith(finalRecord);
    });

    it('should trigger PUT request', async () => {
      const newMutator = cloneDeep(mutatorMock);

      newMutator.contributionCriteria.GET = jest.fn(() => Promise.resolve({ contributionCriteria }));

      await act(async () => {
        await renderContributionCriteriaCreateEditRoute({
          history,
          mutator: newMutator,
        });
      });
      await act(async () => { await ContributionCriteriaForm.mock.calls[3][0].onSubmit(record); });
      expect(putMock).toHaveBeenCalledWith(finalRecord);
    });
  });

  describe('ContributionCriteriaForm', () => {
    it('should be rendered', async () => {
      await waitFor(() => {
        renderContributionCriteriaCreateEditRoute({ history });
      });
      expect(screen.getByText('ContributionCriteriaForm')).toBeVisible();
    });

    it('should receive initialValues with response', async () => {
      const newMutator = cloneDeep(mutatorMock);

      newMutator.contributionCriteria.GET = jest.fn(() => Promise.resolve(contributionCriteria));

      await waitFor(() => {
        renderContributionCriteriaCreateEditRoute({
          history,
          mutator: newMutator,
        });
      });

      expect(ContributionCriteriaForm.mock.calls[3][0].initialValues).toEqual({
        ...omit(contributionCriteria, LOCATIONS_IDS),
        locationIds: [
          {
            value: '99880669-07cc-4658-b213-e6200344d1c3',
            label: 'testLocation1'
          },
          {
            value: '0ac0ffe6-c3ee-4610-b15c-019bbaea5dbd',
            label: 'testLocation2'
          },
          {
            value: 'dfc42e20-7883-4c71-a3cf-f4c0aab1aedc',
            label: 'testLocation3'
          }
        ],
      });
    });
  });
});
