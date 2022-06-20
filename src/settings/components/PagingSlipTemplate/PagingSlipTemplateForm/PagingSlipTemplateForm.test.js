import React from 'react';
import { screen, act } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { TemplateEditor } from '@folio/stripes-template-editor';
import userEvent from '@testing-library/user-event';
import { translationsProperties } from '../../../../../test/jest/helpers';
import PagingSlipTemplateForm from './PagingSlipTemplateForm';
import { TokensList } from './components';
import getTokens from './getTokens';

jest.mock('./getTokens');

jest.mock('@folio/stripes-template-editor', () => ({
  ...jest.requireActual('@folio/stripes-template-editor'),
  TemplateEditor: jest.fn(() => <div>TemplateEditor</div>),
}));

jest.mock('./components', () => ({
  TokensList: jest.fn(() => <div>TokensList</div>),
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

const renderVisiblePatronIdForm = ({
  selectedServer = selectedServerMock,
  pagingSlipTemplate = {},
  isPagingSlipTemplatePending = false,
  handleSubmit,
  onChangeServer,
} = {}) => {
  return renderWithIntl(
    <Router history={createMemoryHistory()}>
      <PagingSlipTemplateForm
        selectedServer={selectedServer}
        serverOptions={serverOptions}
        pagingSlipTemplate={pagingSlipTemplate}
        isPagingSlipTemplatePending={isPagingSlipTemplatePending}
        onSubmit={handleSubmit}
        onChangeServer={onChangeServer}
      />
    </Router>,
    translationsProperties,
  );
};

describe('PagingSlipTemplateForm', () => {
  const handleSubmit = jest.fn();
  const onChangeServer = jest.fn();

  const commonProps = {
    handleSubmit,
    onChangeServer,
  };

  beforeEach(() => {
    TemplateEditor.mockClear();
    TokensList.mockClear();
  });

  it('should be rendered', () => {
    const { container } = renderVisiblePatronIdForm(commonProps);

    expect(container).toBeVisible();
  });

  it('should cause onChangeServer callback', () => {
    renderVisiblePatronIdForm(commonProps);
    screen.getByText('centralServer1').click();
    expect(onChangeServer).toHaveBeenCalled();
  });

  it('should render hand the correct props to TemplateEditor', () => {
    const getTokensMock = getTokens.mockImplementation(() => ({
      item: [
        { 'previewValue': 'Fool moon / Jim Butcher.', 'token': 'item.title' },
      ],
    }));
    const expectedProps = {
      printable: true,
      label: 'Display',
      tokens: getTokensMock(),
      previewModalHeader: 'Preview of INN-Reach Paging Slip',
      tokensList: TokensList,
    };

    renderVisiblePatronIdForm(commonProps);
    expect(TemplateEditor).toHaveBeenNthCalledWith(1, expect.objectContaining(expectedProps), {});
  });

  describe('"Save" button conditions', () => {
    beforeEach(() => {
      renderVisiblePatronIdForm({
        ...commonProps,
        initialValues: {
          description: '',
          template: '<div><br></div>',
        },
      });
    });

    describe('when changing the value of description field', () => {
      beforeEach(() => {
        userEvent.type(screen.getByRole('textbox', { name: 'Description' }), 'a');
      });

      it('should be enabled', () => {
        expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
      });

      it('should be disabled', () => {
        userEvent.type(screen.getByRole('textbox', { name: 'Description' }), '{backspace}');
        expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
      });
    });

    describe('when changing the value of TemplateEditor field', () => {
      beforeEach(() => {
        act(() => { TemplateEditor.mock.calls[0][0].input.onChange('b'); });
      });

      it('should be enabled', () => {
        expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
      });

      it('should be disabled', () => {
        act(() => { TemplateEditor.mock.calls[1][0].input.onChange(''); });
        expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
      });
    });
  });
});
