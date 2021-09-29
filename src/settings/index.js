import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  stripesConnect,
} from '@folio/stripes-core';
import {
  Callout,
  LoadingPane,
} from '@folio/stripes-components';

import {
  CalloutContext,
  SettingsContext,
} from '../contexts';
import {
  CALLOUT_ERROR_TYPE,
  CENTRAL_SERVERS_LIMITING,
  CIRCULATION_MAPPINGS,
  RECORD_CONTRIBUTION,
  SETTINGS_PANE_WIDTH,
} from '../constants';
import {
  sections,
} from '../constants/sections';
import {
  Settings,
} from './components';
import { useCallout } from '../hooks';

const InnReachSettings = ({
  children,
  match: {
    path,
  },
  mutator,
  location,
}) => {
  const showCallout = useCallout();
  const calloutRef = useRef(null);
  const [centralServers, setCentralServers] = useState([]);
  const [sectionsToShow, setSectionsToShow] = useState(sections);
  const [isLoading, setIsLoading] = useState(false);

  const showAllSections = () => {
    setSectionsToShow(sections);
  };

  const showFilteredSections = () => {
    const filteredSections = sections.filter(section => (
      ![RECORD_CONTRIBUTION, CIRCULATION_MAPPINGS].includes(section.id)
    ));

    setSectionsToShow(filteredSections);
  };

  useEffect(() => {
    if (isEmpty(centralServers)) {
      showFilteredSections();
    } else {
      showAllSections();
    }
  }, [centralServers]);

  useEffect(() => {
    setIsLoading(true);

    mutator.centralServerRecords.GET()
      .then(response => setCentralServers(response.centralServers))
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.callout.connectionProblem.get" />,
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <LoadingPane defaultWidth={SETTINGS_PANE_WIDTH} />;
  }

  return (
    <>
      <SettingsContext.Provider
        value={{
          onShowAllSections: showAllSections,
          onShowFilteredSections: showFilteredSections,
        }}
      >
        <CalloutContext.Provider value={calloutRef.current}>
          <Settings
            path={path}
            sections={sectionsToShow}
            location={location}
          />
          {children}
        </CalloutContext.Provider>
      </SettingsContext.Provider>
      <Callout ref={calloutRef} />
    </>
  );
};

InnReachSettings.manifest = Object.freeze({
  centralServerRecords: {
    type: 'okapi',
    path: `inn-reach/central-servers?limit=${CENTRAL_SERVERS_LIMITING}`,
    fetch: false,
    accumulate: true,
    throwErrors: false,
  },
});

InnReachSettings.propTypes = {
  location: PropTypes.object.isRequired,
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    centralServerRecords: PropTypes.shape({
      GET: PropTypes.func,
    }),
  }).isRequired,
  children: PropTypes.node,
};

export default stripesConnect(InnReachSettings);
