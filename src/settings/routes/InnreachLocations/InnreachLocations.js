import React from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  stripesShape,
  withStripes,
} from '@folio/stripes/core';
import { ControlledVocab } from '@folio/stripes/smart-components';

const InnreachLocations = ({ stripes }) => {
  const { formatMessage } = useIntl();
  const ConnectedControlledVocab = stripes.connect(ControlledVocab);

  const columnMapping = {
    code: <FormattedMessage id="ui-inn-reach.settings.innreach-locations.location-code" />,
    description: <FormattedMessage id="ui-inn-reach.settings.innreach-locations.description" />,
    lastUpdated: <FormattedMessage id="ui-inn-reach.settings.innreach-locations.last-updated" />,
    actions: <FormattedMessage id="ui-inn-reach.settings.innreach-locations.actions" />,
  };
  const getDisableAttr = () => ({
    disabled: false,
  });
  const actionProps = {
    create: getDisableAttr,
    edit: getDisableAttr,
    delete: getDisableAttr,
  };

  return (
    <ConnectedControlledVocab
      stripes={stripes}
      baseUrl="inn-reach/locations"
      records="locations"
      label={formatMessage({ id: 'ui-inn-reach.settings.central-server.locations' })}
      labelSingular={formatMessage({ id: 'ui-inn-reach.settings.central-server.location' })}
      objectLabel={formatMessage({ id: 'ui-inn-reach.settings.central-server.locations' })}
      visibleFields={['code', 'description']}
      columnMapping={columnMapping}
      hiddenFields={['numberOfObjects']}
      nameKey="locations"
      id="locations"
      sortby="code"
      actionProps={actionProps}
    />
  );
};

InnreachLocations.propTypes = {
  stripes: stripesShape.isRequired,
};

export default withStripes(InnreachLocations);
