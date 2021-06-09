import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  stripesConnect,
} from '@folio/stripes-core';
import {
  Callout,
} from '@folio/stripes-components';

import { CalloutContext } from '../contexts';
import {
  RECORD_CONTRIBUTION,
} from '../constants';
import {
  sections,
} from './components/Settings/constants';
import {
  Settings,
} from './components';

const InnReachSettings = ({
  children,
  match: {
    path,
  },
  resources: {
    centralServerRecords: {
      records: centralServers,
    },
  },
}) => {
  const calloutRef = useRef(null);
  const [sectionsToShow, setSectionsToShow] = useState(sections);

  useEffect(() => {
    if (isEmpty(centralServers)) {
      const filteredSections = sections.filter(section => (
        ![RECORD_CONTRIBUTION].includes(section.id)
      ));

      setSectionsToShow(filteredSections);
    } else {
      setSectionsToShow(sections);
    }
  }, [centralServers]);

  return (
    <>
      <CalloutContext.Provider value={calloutRef.current}>
        <Settings
          path={path}
          sections={sectionsToShow}
          centralServers={centralServers}
        />
        {children}
      </CalloutContext.Provider>
      <Callout ref={calloutRef} />
    </>
  );
};

InnReachSettings.manifest = Object.freeze({
  centralServerRecords: {
    type: 'okapi',
    path: 'inn-reach/central-servers',
    throwErrors: false,
  },
});

InnReachSettings.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  resources: PropTypes.shape({
    centralServerRecords: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    })
  }).isRequired,
  children: PropTypes.node,
};

export default stripesConnect(InnReachSettings);
