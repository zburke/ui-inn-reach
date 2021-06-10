import React from 'react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { createMemoryHistory } from 'history';
import { useParams } from 'react-router-dom';
import { translationsProperties } from '../../../../test/jest/helpers';
import ContributionCriteriaCreateEditRoute from './ContributionCriteriaCreateEditRoute';

jest.mock('../../components/ContributionCriteria/ContributionCriteriaForm', () => {
  return jest.fn(() => 'ContributionCriteriaForm');
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({}),
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

let isCreation;

const contributionCriteria = {
  centralServerId: 'efb089d4-4416-4892-ab81-bdfa00e4a2c3',
  locationIds: [
    '99880669-07cc-4658-b213-e6200344d1c3',
    '0ac0ffe6-c3ee-4610-b15c-019bbaea5dbd',
    'dfc42e20-7883-4c71-a3cf-f4c0aab1aedc'
  ],
  contributeButSuppressId: '54a61ace-affc-4bf9-a9b9-d604b2d36250',
  doNotContributeId: '19e8ee99-2e6b-4e2d-96e6-402d9caf9efa',
  contributeAsSystemOwnedId: '73c8ba83-b80f-4287-a02d-79906d7864f1',
};

const resources = {
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
    failed: isCreation,
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
  prevServerName = 'testPrevName',
  onAssignPrevServerName,
  onAppointIsPristine,
  mutator = {},
  onFooter,
} = {}) => {
  useParams.mockClear().mockReturnValue({ id: 2 });

  return renderWithIntl(
    <ContributionCriteriaCreateEditRoute
      resources={resources}
      history={createMemoryHistory()}
      isPristine={isPristine}
      prevServerName={prevServerName}
      centralServersOptions={centralServersOptions}
      mutator={mutator}
      serverSelection={serverSelection}
      onAssignPrevServerName={onAssignPrevServerName}
      onAppointIsPristine={onAppointIsPristine}
      onFooter={onFooter}
    />,
    translationsProperties,
  );
};

describe('ContributionCriteriaCreateEditRoute component', () => {
  const onAssignPrevServerName = jest.fn();
  const onAppointIsPristine = jest.fn();
  const onFooter = jest.fn();

  const commonProps = {
    onAssignPrevServerName,
    onAppointIsPristine,
    onFooter,
  };

  it('should be rendered', () => {
    const { container } = renderContributionCriteriaCreateEditRoute(commonProps);

    expect(container).toBeVisible();
  });
});
