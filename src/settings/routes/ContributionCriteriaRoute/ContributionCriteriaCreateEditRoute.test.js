import React from 'react';
import {
  cloneDeep,
} from 'lodash';
import { createMemoryHistory } from 'history';
import { act } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { ConfirmationModal } from '@folio/stripes-components';

import { translationsProperties } from '../../../../test/jest/helpers';
import ContributionCriteriaCreateEditRoute from './ContributionCriteriaCreateEditRoute';
import ContributionCriteriaForm from '../../components/ContributionCriteria/ContributionCriteriaForm';

jest.mock('../../components/ContributionCriteria/ContributionCriteriaForm', () => {
  return jest.fn(() => 'ContributionCriteriaForm');
});

const centralServerId = 'efb089d4-4416-4892-ab81-bdfa00e4a2c3';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({ id: centralServerId }),
}));

jest.mock('@folio/stripes-components', () => ({
  ConfirmationModal: jest.fn(() => 'ConfirmationModal'),
}));

const locations = [
  {
    id: 1,
    name: 'testLocation1',
  },
  {
    id: 2,
    name: 'testLocation2',
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

const contributionCriteria = {
  centralServerId,
  locationIds: [
    '99880669-07cc-4658-b213-e6200344d1c3',
    '0ac0ffe6-c3ee-4610-b15c-019bbaea5dbd',
    'dfc42e20-7883-4c71-a3cf-f4c0aab1aedc'
  ],
  contributeButSuppressId: '54a61ace-affc-4bf9-a9b9-d604b2d36250',
  doNotContributeId: '19e8ee99-2e6b-4e2d-96e6-402d9caf9efa',
  contributeAsSystemOwnedId: '73c8ba83-b80f-4287-a02d-79906d7864f1',
};

const resourcesMock = {
  folioLocations: {
    records: locations,
  },
  statisticalCodeTypes: {
    records: statisticalCodeTypesData,
  },
  statisticalCodes: {
    records: statisticalCodesData,
  },
  contributionCriteria: {
    failed: false,
    records: contributionCriteria,
  },
};

const centralServersOptions = [
  {
    id: '5f552f82-91a8-4700-9814-988826d825c9',
    value: 'testName',
    label: 'testName'
  },
  {
    id: '0b3a1862-ef3c-4ef4-beba-f6444069a5f5',
    value: 'testName2',
    label: 'testName2'
  }
];

const serverSelection = <div>Server Selection</div>;

const renderContributionCriteriaCreateEditRoute = ({
  isPristine = true,
  prevServerName = '',
  onChangePrevServerName,
  onChangePristineState,
  resources = resourcesMock,
  mutator = {},
  renderFooter,
  history,
} = {}) => {
  return renderWithIntl(
    <ContributionCriteriaCreateEditRoute
      resources={resources}
      history={history}
      isPristine={isPristine}
      prevServerName={prevServerName}
      centralServersOptions={centralServersOptions}
      mutator={mutator}
      serverSelection={serverSelection}
      onChangePrevServerName={onChangePrevServerName}
      onChangePristineState={onChangePristineState}
      renderFooter={renderFooter}
    />,
    translationsProperties,
  );
};

describe('ContributionCriteriaCreateEditRoute component', () => {
  const onChangePrevServerName = jest.fn();
  const onChangePristineState = jest.fn();
  const renderFooter = jest.fn();
  let history;

  const commonProps = {
    onChangePrevServerName,
    onChangePristineState,
    renderFooter,
  };

  beforeEach(() => {
    ConfirmationModal.mockClear();
    ContributionCriteriaForm.mockClear();
    history = createMemoryHistory();
  });

  it('should be rendered', () => {
    const { container } = renderContributionCriteriaCreateEditRoute({
      ...commonProps,
      history,
    });

    expect(container).toBeVisible();
  });

  describe('ContributionCriteriaForm', () => {
    it('should change isResetForm prop', () => {
      renderContributionCriteriaCreateEditRoute({
        ...commonProps,
        history,
      });
      expect(ContributionCriteriaForm.mock.calls[0][0].isResetForm).toBeFalsy();
      act(() => {
        ContributionCriteriaForm.mock.calls[0][0].onChangeFormResetState(true);
      });
      expect(ContributionCriteriaForm.mock.calls[1][0].isResetForm).toBeTruthy();
    });
  });

  describe('redirect', () => {
    let historyPushSpy;

    beforeEach(() => {
      renderContributionCriteriaCreateEditRoute({
        ...commonProps,
        isPristine: false,
        history,
        prevServerName: 'testName2',
      });

      historyPushSpy = jest.spyOn(history, 'push');
      act(() => history.push('/settings'));
    });

    it('should call onChangePristineState callback with true', () => {
      expect(onChangePristineState).toHaveBeenCalledWith(true);
    });

    it('should open modal', () => {
      expect(ConfirmationModal.mock.calls[1][0].open).toBeTruthy();
    });

    describe('confirm a modal', () => {
      beforeEach(() => {
        act(() => ConfirmationModal.mock.calls[1][0].onConfirm());
      });

      it('should change the isPristine state to false', () => {
        expect(onChangePristineState).toHaveBeenCalledWith(false);
      });

      it('should call onChangePrevServerName callback with prevServerName', () => {
        expect(onChangePrevServerName).toHaveBeenCalledWith('testName2');
      });

      it('should change openModal state to false', () => {
        expect(ConfirmationModal.mock.calls[2][0].openModal).toBeFalsy();
      });
    });

    describe('cancel a modal', () => {
      it('should redirect', () => {
        act(() => ConfirmationModal.mock.calls[1][0].onCancel());
        expect(historyPushSpy).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('submit', () => {
    const postMock = jest.fn(() => Promise.resolve());
    const putMock = jest.fn(() => Promise.resolve());
    const record = {
      ...contributionCriteria,
      locationIds: [
        { value: '99880669-07cc-4658-b213-e6200344d1c3' },
        { value: '0ac0ffe6-c3ee-4610-b15c-019bbaea5dbd' },
        { value: 'dfc42e20-7883-4c71-a3cf-f4c0aab1aedc' },
      ],
    };
    const finalRecord = contributionCriteria;

    it('should cause POST request', () => {
      const resourcesForPOST = cloneDeep(resourcesMock);

      resourcesForPOST.contributionCriteria.failed = true;

      renderContributionCriteriaCreateEditRoute({
        ...commonProps,
        history,
        resources: resourcesForPOST,
        mutator: {
          contributionCriteria: {
            POST: postMock,
          },
        },
      });

      ContributionCriteriaForm.mock.calls[0][0].onSubmit(record);
      expect(postMock).toHaveBeenCalledWith(finalRecord);
    });

    it('should trigger PUT request', () => {
      renderContributionCriteriaCreateEditRoute({
        ...commonProps,
        history,
        mutator: {
          contributionCriteria: {
            PUT: putMock,
          },
        },
      });

      ContributionCriteriaForm.mock.calls[0][0].onSubmit(record);
      expect(putMock).toHaveBeenCalledWith(finalRecord);
    });
  });
});
