import React, { useRef } from 'react';
import { FormattedMessage } from 'react-intl';

import { Settings } from '@folio/stripes-smart-components';
import {
  stripesShape,
} from '@folio/stripes/core';
import { Callout } from '@folio/stripes-components';

import {
  CentralServersConfigurationRoute,
  InnreachLocations,
} from './routes';
import { CalloutContext } from '../contexts';
import {
  SETTINGS_PANE_WIDTH,
} from '../constants';

const sections = [
  {
    label: <FormattedMessage id="ui-inn-reach.settings.general" />,
    pages: [
      {
        route: 'central-server-configurations',
        label: <FormattedMessage id="ui-inn-reach.settings.central-server.configuration" />,
        component: CentralServersConfigurationRoute,
      },
      {
        route: 'locations',
        label: <FormattedMessage id="ui-inn-reach.settings.central-server.locations" />,
        component: InnreachLocations,
      },
    ],
  },
];

export default function InnReachSettings(props) {
  const calloutRef = useRef(null);

  return (
    <>
      <CalloutContext.Provider value={calloutRef.current}>
        <Settings
          {...props}
          navPaneWidth={SETTINGS_PANE_WIDTH}
          paneTitle={<FormattedMessage id="ui-inn-reach.meta.title" />}
          sections={sections}
        />
      </CalloutContext.Provider>
      <Callout ref={calloutRef} />
    </>
  );
}

InnReachSettings.propTypes = {
  stripes: stripesShape.isRequired,
};
