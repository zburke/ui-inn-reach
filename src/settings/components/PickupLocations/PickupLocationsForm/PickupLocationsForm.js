import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import {
  Field,
} from 'react-final-form';

import {
  Pane,
  Button,
  PaneFooter,
  Checkbox,
  Selection,
} from '@folio/stripes-components';
import stripesFinalForm from '@folio/stripes/final-form';

import {
  CENTRAL_SERVER_ID,
  DEFAULT_PANE_WIDTH,
  PICKUP_LOCATIONS_FIELDS,
} from '../../../../constants';

const {
  CHECK_PICKUP_LOCATION,
} = PICKUP_LOCATIONS_FIELDS;

const PickupLocationsForm = ({
  selectedServer,
  serverOptions,
  pristine,
  handleSubmit,
  onChangeServer,
}) => {
  const { formatMessage } = useIntl();

  const getFooter = () => {
    const saveButton = (
      <Button
        marginBottom0
        buttonStyle="primary mega"
        type="submit"
        disabled={pristine}
        onClick={handleSubmit}
      >
        <FormattedMessage id="ui-inn-reach.settings.pickup-locations.button.save" />
      </Button>
    );

    return <PaneFooter renderEnd={saveButton} />;
  };

  return (
    <Pane
      defaultWidth={DEFAULT_PANE_WIDTH}
      footer={getFooter()}
      paneTitle={<FormattedMessage id='ui-inn-reach.settings.pickup-locations.title' />}
    >
      <form>
        <Selection
          id={CENTRAL_SERVER_ID}
          label={<FormattedMessage id="ui-inn-reach.settings.field.centralServer" />}
          dataOptions={serverOptions}
          placeholder={formatMessage({ id: 'ui-inn-reach.settings.placeholder.centralServer' })}
          value={selectedServer.name}
          onChange={onChangeServer}
        />
        {selectedServer.id &&
          <Field
            name={CHECK_PICKUP_LOCATION}
            type="checkbox"
            label={<FormattedMessage id="ui-inn-reach.settings.pickup-locations.field.enable-local-pickup-locations" />}
            component={Checkbox}
          />
        }
      </form>
    </Pane>
  );
};

PickupLocationsForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  selectedServer: PropTypes.object.isRequired,
  serverOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChangeServer: PropTypes.func.isRequired,
};

export default stripesFinalForm({
  navigationCheck: true,
})(PickupLocationsForm);
