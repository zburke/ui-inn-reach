import React, {
  useCallback,
} from 'react';
import PropTypes from 'prop-types';

import {
  Pane,
  Row,
  Col,
  AccordionStatus,
  AccordionSet,
  ExpandAllButton,
  Headline,
} from '@folio/stripes-components';

import {
  GeneralInformation,
  ServerConnection,
} from './components';
import {
  ActionItem,
} from '../../../../components/common';
import {
  FirsrMenuCloseButton,
} from '../../common';
import {
  DEFAULT_PANE_WIDTH,
  ICONS,
  CENTRAL_SERVER_CONFIGURATION_FIELDS,
  INITIAL_CENTRAL_SERVER_CONFIGURATION_ACCORDION_STATE,
} from '../../../../constants';

import css from './CentralServersConfigurationView.css';

const CentralServersConfigurationView = ({
  centralServer,
  showActionMenu,
  paneTitle,
  onBack,
  onDelete,
  onEdit,
}) => {
  const getFirstMenu = useCallback(() => (
    <FirsrMenuCloseButton onClickHandler={onBack} />
  ), [onBack]);

  // eslint-disable-next-line react/prop-types
  const getActionMenu = ({ onToggle }) => {
    return showActionMenu ? (
      <>
        <ActionItem
          id="editCentralServerConfigurationAction"
          icon={ICONS.EDIT}
          buttonTextTranslationKey="ui-inn-reach.settings.central-server-configuration.action.edit"
          onClickHandler={onEdit}
          onToggle={onToggle}
        />
        <ActionItem
          id="deleteCentralServerConfigurationAction"
          icon={ICONS.DELETE}
          buttonTextTranslationKey="ui-inn-reach.settings.central-server-configuration.action.delete"
          onClickHandler={onDelete}
          onToggle={onToggle}
        />
      </>
    ) : null;
  };

  return (
    <Pane
      defaultWidth={DEFAULT_PANE_WIDTH}
      paneTitle={paneTitle()}
      firstMenu={getFirstMenu()}
      actionMenu={getActionMenu}
    >
      <AccordionStatus>
        <Row>
          <Col xs={9}>
            <Headline
              data-testid="view-headline"
              size="x-large"
              tag="h2"
              margin="small"
              className={css.HeadLine}
            >
              {centralServer[CENTRAL_SERVER_CONFIGURATION_FIELDS.NAME]}
            </Headline>
          </Col>
          <Col xs={3}>
            <Row end="xs">
              <Col
                xs
                data-testid="expand-all-button"
              >
                <ExpandAllButton />
              </Col>
            </Row>
          </Col>
        </Row>
        <AccordionSet initialStatus={INITIAL_CENTRAL_SERVER_CONFIGURATION_ACCORDION_STATE}>
          <GeneralInformation centralServer={centralServer} />
          <ServerConnection centralServer={centralServer} />
        </AccordionSet>
      </AccordionStatus>
    </Pane>
  );
};

CentralServersConfigurationView.propTypes = {
  centralServer: PropTypes.object.isRequired,
  paneTitle: PropTypes.func.isRequired,
  showActionMenu: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default CentralServersConfigurationView;
