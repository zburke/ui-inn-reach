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
import ContributionOptionsCreateEditRoute from './ContributionOptionsCreateEditRoute';
import ContributionOptionsForm from '../../components/ContributionOptions/ContributionOptionsForm';
import { useCentralServers } from '../../../hooks';
import {
  CONTRIBUTION_OPTIONS_FIELDS,
  STATUSES_LIST,
} from '../../../constants';

const {
  CENTRAL_SERVER_ID,
  LOCATION_IDS,
  MATERIAL_TYPE_IDS,
  LOAN_TYPE_IDS,
  STATUSES,
} = CONTRIBUTION_OPTIONS_FIELDS;

jest.mock('../../components/ContributionOptions/ContributionOptionsForm', () => {
  return jest.fn(() => <div>ContributionOptionsForm</div>);
});

jest.mock('../../../hooks', () => ({
  ...jest.requireActual('../../../hooks'),
  useCentralServers: jest.fn().mockReturnValue([]),
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

const materialTypes = [
  {
    id: '7a82f404-07df-4e5e-8e8f-a15f3b6ddffa',
    name: 'testMaterialType1',
  },
  {
    id: '7a82f404-07df-4e5e-8e8f-a15f3b6ddffb',
    name: 'testMaterialType2',
  }
];

const loanTypes = [
  {
    id: '7a82f404-07df-4e5e-8e8f-a15f3b6ddffa',
    name: 'testLoanType1',
  },
  {
    id: '7a82f404-07df-4e5e-8e8f-a15f3b6ddffb',
    name: 'testLoanType2',
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

const contributionOptions = {
  centralServerId: servers[1].id,
  nonLendableLocations: [
    '99880669-07cc-4658-b213-e6200344d1c3',
    '0ac0ffe6-c3ee-4610-b15c-019bbaea5dbd',
    'dfc42e20-7883-4c71-a3cf-f4c0aab1aedc'
  ],
  notAvailableItemStatuses: [
    STATUSES_LIST.AWAITING_DELIVERY,
    STATUSES_LIST.IN_PROCESS,
  ],
  nonLendableMaterialTypes: [
    '7a82f404-07df-4e5e-8e8f-a15f3b6ddffa',
    '7a82f404-07df-4e5e-8e8f-a15f3b6ddffb',
  ],
  nonLendableLoanTypes: [
    '7a82f404-07df-4e5e-8e8f-a15f3b6ddffa',
    '7a82f404-07df-4e5e-8e8f-a15f3b6ddffb',
  ],
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
  },
  folioLocations: {
    records: [{ locations }],
  },
  materialTypes: {
    records: [{ mtypes: materialTypes }],
  },
  loanTypes: {
    records: [{ loantypes: loanTypes }],
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
  contributionOptions: {
    GET: getMock,
    PUT: putMock,
    POST: postMock,
  },
};

const renderContributionOptionsCreateEditRoute = ({
  resources = resourcesMock,
  mutator = mutatorMock,
  history,
} = {}) => {
  return renderWithIntl(
    <ContributionOptionsCreateEditRoute
      history={history}
      mutator={mutator}
      resources={resources}
    />,
    translationsProperties,
  );
};

describe('ContributionOptionsCreateEditRoute component', () => {
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
    ContributionOptionsForm.mockClear();
    history = createMemoryHistory();
    useCentralServers.mockClear().mockReturnValue([
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
    ]);
  });

  it('should be rendered', async () => {
    let component;

    await waitFor(() => {
      component = renderContributionOptionsCreateEditRoute({ history });
    });
    expect(component).toBeDefined();
  });

  it('should call GET', async () => {
    await waitFor(() => {
      renderContributionOptionsCreateEditRoute({ history });
    });
    expect(replaceMock).toHaveBeenCalled();
    expect(getMock).toHaveBeenCalled();
  });

  describe('submit', () => {
    const record = {
      ...contributionOptions,
      nonLendableLocations: [
        { value: '99880669-07cc-4658-b213-e6200344d1c3' },
        { value: '0ac0ffe6-c3ee-4610-b15c-019bbaea5dbd' },
        { value: 'dfc42e20-7883-4c71-a3cf-f4c0aab1aedc' },
      ],
      nonLendableMaterialTypes: [
        { value: '7a82f404-07df-4e5e-8e8f-a15f3b6ddffa' },
        { value: '7a82f404-07df-4e5e-8e8f-a15f3b6ddffb' },
      ],
      nonLendableLoanTypes: [
        { value: '7a82f404-07df-4e5e-8e8f-a15f3b6ddffa' },
        { value: '7a82f404-07df-4e5e-8e8f-a15f3b6ddffb' },
      ],
      notAvailableItemStatuses: [
        { value: STATUSES_LIST.AWAITING_DELIVERY },
        { value: STATUSES_LIST.IN_PROCESS },
      ],
    };
    const finalRecord = contributionOptions;

    it('should cause POST request', async () => {
      const newMutator = cloneDeep(mutatorMock);

      newMutator.contributionOptions.GET = jest.fn(() => Promise.reject());

      await waitFor(() => {
        renderContributionOptionsCreateEditRoute({
          history,
          mutator: newMutator,
        });
      });
      await act(async () => { await ContributionOptionsForm.mock.calls[3][0].onSubmit(record); });
      expect(postMock).toHaveBeenCalledWith(finalRecord);
    });

    it('should trigger PUT request', async () => {
      const newMutator = cloneDeep(mutatorMock);

      newMutator.contributionOptions.GET = jest.fn(() => Promise.resolve({ contributionOptions }));

      await waitFor(() => {
        renderContributionOptionsCreateEditRoute({
          history,
          mutator: newMutator,
        });
      });
      await act(async () => { await ContributionOptionsForm.mock.calls[3][0].onSubmit(record); });
      expect(putMock).toHaveBeenCalledWith(finalRecord);
    });
  });

  describe('ContributionOptionsForm', () => {
    it('should be rendered', async () => {
      await waitFor(() => {
        renderContributionOptionsCreateEditRoute({ history });
      });
      expect(screen.getByText('ContributionOptionsForm')).toBeVisible();
    });

    it('should receive initialValues with response', async () => {
      const newMutator = cloneDeep(mutatorMock);

      newMutator.contributionOptions.GET = jest.fn(() => Promise.resolve(contributionOptions));

      await waitFor(() => {
        renderContributionOptionsCreateEditRoute({
          history,
          mutator: newMutator,
        });
      });

      expect(ContributionOptionsForm.mock.calls[3][0].initialValues).toEqual({
        ...omit(contributionOptions, LOCATION_IDS, CENTRAL_SERVER_ID, MATERIAL_TYPE_IDS, LOAN_TYPE_IDS, STATUSES),
        nonLendableLocations: [
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
        nonLendableLoanTypes: [
          {
            value: '7a82f404-07df-4e5e-8e8f-a15f3b6ddffa',
            label: 'testLoanType1',
          },
          {
            value: '7a82f404-07df-4e5e-8e8f-a15f3b6ddffb',
            label: 'testLoanType2',
          }
        ],
        nonLendableMaterialTypes: [
          {
            value: '7a82f404-07df-4e5e-8e8f-a15f3b6ddffa',
            label: 'testMaterialType1',
          },
          {
            value: '7a82f404-07df-4e5e-8e8f-a15f3b6ddffb',
            label: 'testMaterialType2',
          }
        ],
        notAvailableItemStatuses: [
          {
            label: STATUSES_LIST.AWAITING_DELIVERY,
            value: STATUSES_LIST.AWAITING_DELIVERY,
          },
          {
            label: STATUSES_LIST.IN_PROCESS,
            value: STATUSES_LIST.IN_PROCESS,
          },
        ]
      });
    });
  });
});
