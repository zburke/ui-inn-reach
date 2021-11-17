import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { translationsProperties } from '../../../../../test/jest/helpers';
import InnReachRecallForm from './InnReachRecallForm';

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

const parentMutatorMock = {
  selectedServerId: {
    replace: jest.fn(),
  },
  innReachRecallUser: {
    GET: jest.fn(() => Promise.resolve()),
    PUT: jest.fn(() => Promise.resolve()),
    POST: jest.fn(() => Promise.resolve()),
  },
  users: {
    GET: jest.fn(() => Promise.resolve()),
    PUT: jest.fn(() => Promise.resolve()),
    POST: jest.fn(() => Promise.resolve()),
  },
};

const renderInnReachRecallForm = ({
  selectedServer = selectedServerMock,
  initialValues = {},
  innReachRecallUser = {},
  isInnReachRecallUserPending = false,
  parentMutator = parentMutatorMock,
  handleSubmit,
  onChangeServer,
} = {}) => {
  return renderWithIntl(
    <Router history={createMemoryHistory()}>
      <InnReachRecallForm
        selectedServer={selectedServer}
        serverOptions={serverOptions}
        initialValues={initialValues}
        innReachRecallUser={innReachRecallUser}
        isInnReachRecallUserPending={isInnReachRecallUserPending}
        parentMutator={parentMutator}
        onSubmit={handleSubmit}
        onChangeServer={onChangeServer}
      />
    </Router>,
    translationsProperties,
  );
};

describe('InnReachRecallForm', () => {
  const handleSubmit = jest.fn();
  const onChangeServer = jest.fn();

  const commonProps = {
    handleSubmit,
    onChangeServer,
  };

  it('should be rendered', () => {
    const { container } = renderInnReachRecallForm(commonProps);

    expect(container).toBeVisible();
  });

  it('should cause onChangeServer callback', () => {
    renderInnReachRecallForm(commonProps);
    screen.getByText('centralServer1').click();
    expect(onChangeServer).toHaveBeenCalled();
  });

  it('should retrieve a user data', () => {
    renderInnReachRecallForm(commonProps);
    screen.getByText('centralServer1').click();
    const field = screen.getByRole('textbox', { name: 'Recall INN-Reach items as user' });

    userEvent.type(field, 'e2f5ebb7-9285-58f8-bc1e-608ac2080861');
    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
  });

  describe('button conditions', () => {
    it('should be enabled', () => {
      renderInnReachRecallForm(commonProps);
      screen.getByText('centralServer1').click();
      const field = screen.getByRole('textbox', { name: 'Recall INN-Reach items as user' });

      userEvent.type(field, 'e2f5ebb7-9285-58f8-bc1e-608ac2080861');
      expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
    });

    it('should be disabled', () => {
      renderInnReachRecallForm({
        ...commonProps,
        initialValues: {
          recallInnReachItemsAsUser: 'e2f5ebb7-9285-58f8-bc1e-608ac2080861',
        },
      });
      screen.getByText('centralServer1').click();
      expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    });
  });
});
