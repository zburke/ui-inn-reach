import React, {
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  stripesConnect,
  Route,
} from '@folio/stripes/core';
import {
  Button,
  Col,
  LoadingPane,
  Pane,
  PaneFooter,
  Row,
  Selection,
} from '@folio/stripes-components';

import {
  CONTRIBUTION_CRITERIA,
  DEFAULT_PANE_WIDTH,
  UUIDv4RegEx,
} from '../../../constants';
import { getContributionCriteriaUrl } from '../../../utils';
import ContributionCriteriaCreateEditRoute from './ContributionCriteriaCreateEditRoute';

const {
  CENTRAL_SERVER_ID,
} = CONTRIBUTION_CRITERIA;

const ContributionCriteriaSelectionRoute = ({
  resources: {
    centralServerRecords: {
      records: centralServers,
      isPending,
    },
  },
  match,
  location,
  history,
}) => {
  const { formatMessage } = useIntl();

  const [isPristine, setIsPristine] = useState(true);
  const [serverName, setServerName] = useState('');
  const [prevServerName, setPrevServerName] = useState('');

  const centralServersOptions = centralServers.map(({ id, name }) => ({
    id,
    value: name,
    label: name,
  }));

  const changePristineState = (value) => {
    setIsPristine(value);
  };

  const changePrevServerName = (name) => {
    setPrevServerName(name);
  };

  const handleServerChange = (selectedServerName) => {
    const selectedCentralServerId = centralServers.find(server => server.name === selectedServerName).id;

    changePrevServerName(serverName);
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
          id={CENTRAL_SERVER_ID}
          label={<FormattedMessage id="ui-inn-reach.settings.contribution-criteria.field.centralServer" />}
          dataOptions={centralServersOptions}
          placeholder={formatMessage({ id: 'ui-inn-reach.settings.contribution-criteria.placeholder.centralServer' })}
          value={serverName}
          onChange={handleServerChange}
        />
      </Col>
    </Row>
  );

  if (isPending) {
    return <LoadingPane defaultWidth={DEFAULT_PANE_WIDTH} />;
  }

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
            renderFooter={getFooter}
            onChangePrevServerName={changePrevServerName}
            onChangePristineState={changePristineState}
          />
        )}
      />
    </>
  );
};

ContributionCriteriaSelectionRoute.manifest = {
  centralServerRecords: {
    type: 'okapi',
    path: 'inn-reach/central-servers',
    throwErrors: false,
  },
};

ContributionCriteriaSelectionRoute.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    centralServerRecords: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
      isPending: PropTypes.bool,
    }).isRequired,
  }).isRequired,
};

export default stripesConnect(ContributionCriteriaSelectionRoute);
