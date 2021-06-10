import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  Route,
} from '@folio/stripes/core';
import { Button, Col, Pane, PaneFooter, Row, Selection } from '@folio/stripes-components';

import { FormattedMessage, useIntl } from 'react-intl';
import {
  CONTRIBUTION_CRITERIA,
  DEFAULT_PANE_WIDTH,
  UUIDv4RegEx,
} from '../../../constants';
import { getContributionCriteriaUrl } from '../../../utils';
import ContributionCriteriaCreateEditRoute from './ContributionCriteriaCreateEditRoute';
import { SettingsContext } from '../../../contexts';

const ContributionCriteriaSelectionRoute = ({
  match,
  location,
  history,
}) => {
  const { centralServers } = useContext(SettingsContext);
  const { formatMessage } = useIntl();

  const [isPristine, setIsPristine] = useState(true);
  const [serverName, setServerName] = useState('');
  const [prevServerName, setPrevServerName] = useState('');

  const centralServersOptions = centralServers.map(({ id, name }) => ({
    id,
    value: name,
    label: name,
  }));

  const appointIsPristine = (value) => {
    setIsPristine(value);
  };

  const assignPrevServerName = (name) => {
    setPrevServerName(name);
  };

  const handleServerChange = (selectedServerName) => {
    const selectedCentralServerId = centralServers.find(server => server.name === selectedServerName).id;

    assignPrevServerName(serverName);
    setServerName(selectedServerName);
    history.push(getContributionCriteriaUrl(selectedCentralServerId));
  };

  useEffect(() => {
    const uuid = UUIDv4RegEx.exec(location.pathname);

    if (uuid) {
      const selectedServerName = centralServersOptions.find(server => server.id === uuid[0])?.label;

      setPrevServerName('');
      setServerName(selectedServerName);
    } else {
      setServerName('');
      setIsPristine(true);
    }
  }, [location.pathname, centralServersOptions]);

  const getFooter = (handleSubmit) => {
    const saveButton = (
      <Button
        marginBottom0
        data-testid="save-button"
        id="clickable-save-instance"
        buttonStyle="primary small"
        type="submit"
        disabled={isPristine}
        onClick={handleSubmit}
      >
        <FormattedMessage id="ui-inn-reach.settings.contribution-criteria.button.save" />
      </Button>
    );

    return <PaneFooter renderEnd={saveButton} />;
  };

  const serverSelection = (
    <Row>
      <Col sm={12}>
        <Selection
          id={CONTRIBUTION_CRITERIA.CENTRAL_SERVER_ID}
          label={<FormattedMessage id="ui-inn-reach.settings.contribution-criteria.field.centralServer" />}
          dataOptions={centralServersOptions}
          placeholder={formatMessage({ id: 'ui-inn-reach.settings.contribution-criteria.placeholder.centralServer' })}
          value={serverName}
          onChange={handleServerChange}
        />
      </Col>
    </Row>
  );

  return (
    <>
      {!serverName &&
        <Pane
          data-testid="selection-pane"
          defaultWidth={DEFAULT_PANE_WIDTH}
          footer={getFooter()}
          paneTitle={<FormattedMessage id='ui-inn-reach.settings.contribution-criteria.title' />}
        >
          {serverSelection}
        </Pane>
      }
      <Route
        exact
        path={`${match.path}/:id`}
        render={props => (
          <ContributionCriteriaCreateEditRoute
            {...props}
            isPristine={isPristine}
            prevServerName={prevServerName}
            centralServersOptions={centralServersOptions}
            serverSelection={serverSelection}
            onAssignPrevServerName={assignPrevServerName}
            onFooter={getFooter}
            onAppointIsPristine={appointIsPristine}
          />
        )}
      />
    </>
  );
};

ContributionCriteriaSelectionRoute.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }),
};

export default ContributionCriteriaSelectionRoute;
