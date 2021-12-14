import { createMemoryHistory } from 'history';
import { screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { translationsProperties } from '../../../../../test/jest/helpers';
import ItemForm from './ItemForm';

const history = createMemoryHistory();

const renderItemForm = ({
  isOpenModal = false,
  isLoading = false,
  pristine,
  intl = { formatMessage: jest.fn() },
  formRef = {},
  handleSubmit = jest.fn(),
} = {}) => {
  return renderWithIntl(
    <Router history={history}>
      <ItemForm
        isOpenModal={isOpenModal}
        isLoading={isLoading}
        pristine={pristine}
        intl={intl}
        formRef={formRef}
        onSubmit={handleSubmit}
      />
    </Router>,
    translationsProperties,
  );
};

describe('ItemForm', () => {
  const handleSubmit = jest.fn();

  it('should be rendered', () => {
    const { container } = renderItemForm();

    expect(container).toBeVisible();
  });

  describe('modal window', () => {
    const modalTitle = 'No matching INN-Reach transaction found for this item';

    it('should be visible', () => {
      renderItemForm({ isOpenModal: true });
      expect(screen.getByText(modalTitle)).toBeVisible();
    });

    it('should not be visible', () => {
      renderItemForm({ isOpenModal: false });
      expect(screen.queryByText(modalTitle)).not.toBeInTheDocument();
    });
  });

  describe('"Enter" button', () => {
    it('should submit request', () => {
      renderItemForm({ handleSubmit });
      userEvent.type(screen.getByRole('textbox'), '123');
      userEvent.click(screen.getByRole('button', { name: 'Enter' }));
      expect(handleSubmit).toBeCalled();
    });

    it('should be enabled', () => {
      renderItemForm();
      userEvent.type(screen.getByRole('textbox'), '123123');
      expect(screen.getByRole('button', { name: 'Enter' })).toBeEnabled();
    });

    it('should be disabled', () => {
      renderItemForm();
      expect(screen.getByRole('button', { name: 'Enter' })).toBeDisabled();
    });
  });
});
