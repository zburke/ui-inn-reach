import React from 'react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { translationsProperties } from '../../../../../test/jest/helpers';
import { DEFAULT_VALUES } from '../../../routes/ContributionCriteriaRoute/ContributionCriteriaCreateEditRoute';
import ContributionCriteriaForm from './ContributionCriteriaForm';

const serverSelection = <div>Server Selection</div>;
const folioLocations = [
  {
    id: 1,
    name: 'testLocation1',
  },
  {
    id: 2,
    name: 'testLocation2',
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

const renderContributionCriteriaForm = ({
  initialValues = DEFAULT_VALUES,
  isResetForm = false,
  onAppointIsResetForm,
  onAppointIsPristine,
  onFooter,
  history = createMemoryHistory(),
  handleSubmit,
} = {}) => {
  return renderWithIntl(
    <Router history={history}>
      <ContributionCriteriaForm
        folioLocations={folioLocations}
        statisticalCodes={statisticalCodes}
        statisticalCodeTypes={statisticalCodeTypes}
        initialValues={initialValues}
        isResetForm={isResetForm}
        serverSelection={serverSelection}
        onAppointIsResetForm={onAppointIsResetForm}
        onAppointIsPristine={onAppointIsPristine}
        onFooter={onFooter}
        onSubmit={handleSubmit}
      />
    </Router>,
    translationsProperties,
  );
};

describe('ContributionCriteriaForm', () => {
  const onAppointIsResetForm = jest.fn();
  const onAppointIsPristine = jest.fn();
  const onFooter = jest.fn();
  const handleSubmit = jest.fn();

  const commonProps = {
    onAppointIsResetForm,
    onAppointIsPristine,
    onFooter,
    handleSubmit,
  };

  it('should be rendered', () => {
    const { container } = renderContributionCriteriaForm(commonProps);

    expect(container).toBeVisible();
  });

  it('should call onAppointIsResetForm when isReset prop is true', () => {
    renderContributionCriteriaForm({
      ...commonProps,
      isResetForm: true,
    });
    expect(onAppointIsResetForm).toHaveBeenCalledWith(false);
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
        expect(onAppointIsPristine).toHaveBeenCalledWith(true);
        userEvent.selectOptions(screen.getByRole('combobox', { name: 'FOLIO statistical code to exclude from contribution' }), '7a82f404-07df-4e5e-8e8f-a15f3b6ddffa');
        expect(onAppointIsPristine).toHaveBeenCalledWith(false);
      });
    });
  });
});
