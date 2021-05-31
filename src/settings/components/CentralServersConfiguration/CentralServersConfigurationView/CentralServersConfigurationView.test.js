import React from 'react';
import { screen } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import CentralServersConfigurationView from './CentralServersConfigurationView';

import { translationsProperties } from '../../../../../test/jest/helpers';

import {
  CENTRAL_SERVER_CONFIGURATION_FIELDS,
} from '../../../../constants';

jest.mock('./components/GeneralInformation', () => () => (<div>GeneralInformation component</div>));
jest.mock('./components/ServerConnection', () => () => (<div>ServerConnection component</div>));

const centralServer = {
  CENTRAL_SERVER_CONFIGURATION_FIELDS,
};

const RenderView = ({
  showActionMenu = false,
  paneTitle,
  onBack,
  onDelete,
  onEdit,
}) => {
  return (
    <CentralServersConfigurationView
      centralServer={centralServer}
      showActionMenu={showActionMenu}
      paneTitle={paneTitle}
      onBack={onBack}
      onDelete={onDelete}
      onEdit={onEdit}
    />
  );
};

describe('CentralServerConfigurationView component', () => {
  const handlePaneTitle = jest.fn();
  const handleBack = jest.fn();
  const handleDelete = jest.fn();
  const handleEdit = jest.fn();

  const renderedView = (showActionMenu = true) => renderWithIntl(
    <RenderView
      showActionMenu={showActionMenu}
      paneTitle={handlePaneTitle}
      onBack={handleBack}
      onDelete={handleDelete}
      onEdit={handleEdit}
    />,
    translationsProperties,
  );

  it('should be rendered', () => {
    const component = renderedView();

    expect(component).toBeDefined();
  });

  it('should display Cancel icon button', () => {
    renderedView();

    expect(document.querySelector('#pane-header-dismiss-button').getAttribute('aria-label')).toEqual('Cancel');
  });

  it('should display `Actions` menu', () => {
    renderedView();

    expect(screen.getByText('Actions')).toBeDefined();
  });

  it('should not display `Actions` menu', () => {
    renderedView(false);

    expect(screen.queryByText('Actions')).toBeNull();
  });

  it('should display `Collapse all` button', () => {
    renderedView();

    expect(screen.getByText('Collapse all')).toBeDefined();
  });

  it('should render `GeneralInformation` component', () => {
    renderedView();

    expect(screen.getByText('GeneralInformation component')).toBeDefined();
  });

  it('should render `ServerConnection` component', () => {
    renderedView();

    expect(screen.getByText('ServerConnection component')).toBeDefined();
  });
});
