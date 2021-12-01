import React from 'react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { translationsProperties } from '../../../../../test/jest/helpers';
import { DEFAULT_VALUES } from '../../../routes/ContributionCriteriaRoute/utils';
import ContributionCriteriaForm from './ContributionCriteriaForm';
import { CENTRAL_SERVER_ID } from '../../../../constants';

const folioLocations = [
  {
    id: 1,
    name: 'Annex',
    libraryId: '5d78803e-ca04-4b4a-aeae-2c63b924518b',
  },
  {
    id: 2,
    name: 'Online',
    libraryId: 'c2549bb4-19c7-4fcc-8b52-39e612fb7dbe',
  }
];

const statisticalCodes = [
  {
    id: '7a82f404-07df-4e5e-8e8f-a15f3b6ddffa',
    statisticalCodeTypeId: '882a737a-27ce-4f0c-90fc-36b92c6046bf',
    code: 'testCode',
    name: 'testCodeName',
  }
];

const statisticalCodeTypes = [
  {
    name: 'typeName',
    id: '882a737a-27ce-4f0c-90fc-36b92c6046bf',
  }
];

const serverOptions = [
  {
    id: '5f552f82-91a8-4700-9814-988826d825c9',
    value: 'testName',
    localAgencies: [
      {
        folioLibraryIds: ['5d78803e-ca04-4b4a-aeae-2c63b924518b'],
      },
    ],
    label: 'testName'
  },
  {
    id: '0b3a1862-ef3c-4ef4-beba-f6444069a5f5',
    value: 'testName2',
    localAgencies: [
      {
        folioLibraryIds: ['c2549bb4-19c7-4fcc-8b52-39e612fb7dbe'],
      },
    ],
    label: 'testName2'
  }
];

const selectedServerMock = {
  id: serverOptions[1].id,
  name: serverOptions[1].label,
};

const renderContributionCriteriaForm = ({
  selectedServer = selectedServerMock,
  contributionCriteria = {},
  isContributionCriteriaPending = false,
  isPristine = true,
  initialValues = DEFAULT_VALUES,
  isResetForm = false,
  onChangeFormResetState,
  onChangePristineState,
  history = createMemoryHistory(),
  handleSubmit,
  onChangeServer,
} = {}) => {
  return renderWithIntl(
    <Router history={history}>
      <ContributionCriteriaForm
        selectedServer={selectedServer}
        contributionCriteria={contributionCriteria}
        isContributionCriteriaPending={isContributionCriteriaPending}
        isPristine={isPristine}
        serverOptions={serverOptions}
        folioLocations={folioLocations}
        statisticalCodes={statisticalCodes}
        statisticalCodeTypes={statisticalCodeTypes}
        initialValues={initialValues}
        isResetForm={isResetForm}
        onChangeFormResetState={onChangeFormResetState}
        onChangePristineState={onChangePristineState}
        onSubmit={handleSubmit}
        onChangeServer={onChangeServer}
      />
    </Router>,
    translationsProperties,
  );
};

describe('ContributionCriteriaForm', () => {
  const onChangeFormResetState = jest.fn();
  const onChangePristineState = jest.fn();
  const handleSubmit = jest.fn();
  const onChangeServer = jest.fn();

  const commonProps = {
    onChangeFormResetState,
    onChangePristineState,
    handleSubmit,
    onChangeServer,
  };

  it('should be rendered', () => {
    const { container } = renderContributionCriteriaForm(commonProps);

    expect(container).toBeVisible();
  });

  describe('Selection', () => {
    it('should call onChangeServer', () => {
      renderContributionCriteriaForm(commonProps);

      document.getElementById(`option-${CENTRAL_SERVER_ID}-1-testName2`).click();
      expect(onChangeServer).toHaveBeenCalled();
    });
  });

  it('should call onChangeFormResetState when isReset prop is true', () => {
    renderContributionCriteriaForm({
      ...commonProps,
      isResetForm: true,
    });
    expect(onChangeFormResetState).toHaveBeenCalledWith(false);
  });

  it('should only have locations of the selected central server', () => {
    renderContributionCriteriaForm({
      ...commonProps,
      selectedServer: serverOptions[0],
    });
    const libraryOptions = document.querySelectorAll('[id="multiselect-option-list-locationIds"]>li');

    expect(libraryOptions.length).toBe(1);
    expect(screen.getByText('Annex'));
  });

  describe('`FOLIO statistical code to exclude from contribution` field', () => {
    describe('select', () => {
      beforeEach(() => {
        renderContributionCriteriaForm(commonProps);
      });

      it('should have disabled a selected option', () => {
        const selectedOption = document.querySelector('option[value="7a82f404-07df-4e5e-8e8f-a15f3b6ddffa"]');

        expect(selectedOption).toBeEnabled();
        userEvent.selectOptions(screen.getByRole('combobox', { name: 'FOLIO statistical code to exclude from contribution' }), '7a82f404-07df-4e5e-8e8f-a15f3b6ddffa');
        expect(selectedOption).toBeDisabled();
      });

      it('should change the value of isPristine when selected', () => {
        expect(onChangePristineState).toHaveBeenCalledWith(true);
        userEvent.selectOptions(screen.getByRole('combobox', { name: 'FOLIO statistical code to exclude from contribution' }), '7a82f404-07df-4e5e-8e8f-a15f3b6ddffa');
        expect(onChangePristineState).toHaveBeenCalledWith(false);
      });
    });
  });
});
