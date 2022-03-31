import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { translationsProperties } from '../../../../../test/jest/helpers';
import VisiblePatronIdForm from './VisiblePatronIdForm';

jest.mock('@folio/stripes-components', () => ({
  ...jest.requireActual('@folio/stripes-components'),
  MessageBanner: jest.fn(() => <div>MessageBanner</div>),
  MultiSelection: jest.fn(() => <div>MultiSelection</div>),
}));

const serverOptions = [
  {
    id: 'f8723a94-25d5-4f19-9043-cc3c306d54a1',
    label: 'centralServer1',
    value: 'f8723a94-25d5-4f19-9043-cc3c306d54a1'
  },
  {
    id: '6e2b3e23-8d58-4cd3-985d-b4eb2e9a2ec9',
    label: 'centralServer2',
    value: '6e2b3e23-8d58-4cd3-985d-b4eb2e9a2ec9'
  }
];

const selectedServerMock = {
  id: serverOptions[1].id,
  name: serverOptions[1].label,
};

const customFieldPatronOptions = [{
  label: 'Visible patron ID',
  value: 'visiblePatronId'
}];

const renderVisiblePatronIdForm = ({
  selectedServer = selectedServerMock,
  initialValues = {},
  visiblePatronIdConfiguration = {},
  isVisiblePatronIdConfigurationPending = false,
  isCheckedUserCustomField = false,
  handleSubmit,
  onChangeServer,
  onChangeUserCustomCheckbox,
} = {}) => {
  return renderWithIntl(
    <Router history={createMemoryHistory()}>
      <VisiblePatronIdForm
        selectedServer={selectedServer}
        serverOptions={serverOptions}
        initialValues={initialValues}
        customFieldPatronOptions={customFieldPatronOptions}
        visiblePatronIdConfiguration={visiblePatronIdConfiguration}
        isCheckedUserCustomField={isCheckedUserCustomField}
        isVisiblePatronIdConfigurationPending={isVisiblePatronIdConfigurationPending}
        onSubmit={handleSubmit}
        onChangeServer={onChangeServer}
        onChangeUserCustomCheckbox={onChangeUserCustomCheckbox}
      />
    </Router>,
    translationsProperties,
  );
};

describe('VisiblePatronIdForm', () => {
  const handleSubmit = jest.fn();
  const onChangeServer = jest.fn();
  const onChangeUserCustomCheckbox = jest.fn();

  const commonProps = {
    handleSubmit,
    onChangeServer,
    onChangeUserCustomCheckbox,
  };

  it('should be rendered', () => {
    const { container } = renderVisiblePatronIdForm(commonProps);

    expect(container).toBeVisible();
  });

  it('should cause onChangeServer callback', () => {
    renderVisiblePatronIdForm(commonProps);
    screen.getByText('centralServer1').click();
    expect(onChangeServer).toHaveBeenCalled();
  });

  describe('handleChangeServer', () => {
    it('should cause onChangeServer callback', () => {
      renderVisiblePatronIdForm(commonProps);
      document.getElementById('option-centralServerId-0-f8723a94-25d5-4f19-9043-cc3c306d54a1').click();
      expect(onChangeServer).toHaveBeenCalled();
    });
  });

  describe('banner', () => {
    beforeEach(() => {
      renderVisiblePatronIdForm({
        ...commonProps,
        initialValues: {},
      });
    });

    it('should be visible', () => {
      expect(screen.getByText('MessageBanner')).toBeVisible();
    });

    it('should be invisible', () => {
      const checkbox = screen.getByRole('checkbox', { name: 'Barcode' });

      userEvent.click(checkbox);
      expect(screen.queryByText('MessageBanner')).toBeNull();
    });
  });

  describe('"Save" button conditions', () => {
    beforeEach(() => {
      renderVisiblePatronIdForm({
        ...commonProps,
        initialValues: {},
      });
    });

    it('should be enabled if any checkbox is checked besides "User custom fields"', () => {
      const checkbox = screen.getByRole('checkbox', { name: 'Barcode' });

      userEvent.click(checkbox);
      expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
    });

    it('should be disabled when checkbox is checked for "User custom fields" only', () => {
      const checkbox = screen.getByRole('checkbox', { name: 'User custom fields' });

      userEvent.click(checkbox);
      expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    });
  });
});
