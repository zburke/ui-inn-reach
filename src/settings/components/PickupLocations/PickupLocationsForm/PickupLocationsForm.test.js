import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { translationsProperties } from '../../../../../test/jest/helpers';
import PickupLocationsForm from './PickupLocationsForm';

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

const renderComponent = ({
  selectedServer = selectedServerMock,
  handleSubmit,
  onChangeServer,
} = {}) => {
  return renderWithIntl(
    <Router history={createMemoryHistory()}>
      <PickupLocationsForm
        selectedServer={selectedServer}
        serverOptions={serverOptions}
        onSubmit={handleSubmit}
        onChangeServer={onChangeServer}
      />
    </Router>,
    translationsProperties,
  );
};

describe('PickupLocationsForm', () => {
  const handleSubmit = jest.fn();
  const onChangeServer = jest.fn();

  const commonProps = {
    handleSubmit,
    onChangeServer,
  };

  it('should cause onChangeServer callback', () => {
    renderComponent(commonProps);
    screen.getByText('centralServer1').click();
    expect(onChangeServer).toHaveBeenCalled();
  });

  describe('"Save" button conditions', () => {
    beforeEach(() => {
      renderComponent({
        ...commonProps,
        initialValues: {},
      });
    });

    it('should be enabled if any checkbox is checked besides "User custom fields"', () => {
      const checkbox = screen.getByRole('checkbox', { name: 'Enable local pickup locations for item holds' });

      userEvent.click(checkbox);
      expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
    });
  });
});
