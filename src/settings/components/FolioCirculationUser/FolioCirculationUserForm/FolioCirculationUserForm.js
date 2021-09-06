import React from 'react';
import PropTypes from 'prop-types';
import {
  isEqual,
} from 'lodash';
import {
  Button,
  Col,
  Loading,
  MessageBanner,
  Pane,
  PaneFooter,
  Row,
  Selection,
} from '@folio/stripes-components';
import stripesFinalForm from '@folio/stripes/final-form';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  BANNER_ERROR_TYPE,
  CENTRAL_SERVER_ID,
  DEFAULT_PANE_WIDTH,
  FOLIO_CIRCULATION_USER_FIELDS,
} from '../../../../constants';
import TabularList from './components/TabularList';

const {
  BARCODE_MAPPINGS,
  BARCODE,
} = FOLIO_CIRCULATION_USER_FIELDS;

const FolioCirculationUserForm = ({
  selectedServer,
  serverOptions,
  isBarcodeMappingsPending,
  isInnReachPatronTypesPending,
  innReachPatronTypesFailed,
  existingBarcodesSet,
  handleSubmit,
  pristine,
  invalid,
  values,
  form,
  onChangeServer,
}) => {
  const { formatMessage } = useIntl();
  const showTabularList = (
    selectedServer.id && !isBarcodeMappingsPending && !isInnReachPatronTypesPending && !innReachPatronTypesFailed
  );

  const getFooter = () => {
    const isAllFieldsFilledIn = values[BARCODE_MAPPINGS]?.every(field => field[BARCODE]);

    const saveButton = (
      <Button
        marginBottom0
        buttonStyle="primary mega"
        type="submit"
        disabled={pristine || !isAllFieldsFilledIn || invalid}
        onClick={handleSubmit}
      >
        <FormattedMessage id="ui-inn-reach.settings.folio-circulation-user.button.save" />
      </Button>
    );

    return <PaneFooter renderEnd={saveButton} />;
  };

  return (
    <Pane
      defaultWidth={DEFAULT_PANE_WIDTH}
      footer={getFooter()}
      paneTitle={<FormattedMessage id='ui-inn-reach.settings.folio-circulation-user.title' />}
    >
      <Row>
        <Col sm={12}>
          <Selection
            id={CENTRAL_SERVER_ID}
            label={<FormattedMessage id="ui-inn-reach.settings.folio-circulation-user.field.central-server" />}
            dataOptions={serverOptions}
            placeholder={formatMessage({ id: 'ui-inn-reach.settings.folio-circulation-user.placeholder.central-server' })}
            value={selectedServer.name}
            onChange={onChangeServer}
          />
        </Col>
      </Row>
      {isBarcodeMappingsPending && <Loading />}
      <MessageBanner
        type={BANNER_ERROR_TYPE}
        show={innReachPatronTypesFailed}
      >
        <FormattedMessage id="ui-inn-reach.banner.patron-types" />
      </MessageBanner>
      {showTabularList &&
        <TabularList
          form={form}
          invalid={invalid}
          existingBarcodesSet={existingBarcodesSet}
        />
      }
    </Pane>
  );
};

FolioCirculationUserForm.propTypes = {
  existingBarcodesSet: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  innReachPatronTypesFailed: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  isBarcodeMappingsPending: PropTypes.bool.isRequired,
  isInnReachPatronTypesPending: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  selectedServer: PropTypes.object.isRequired,
  serverOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  values: PropTypes.object.isRequired,
  onChangeServer: PropTypes.func.isRequired,
};

export default stripesFinalForm({
  initialValuesEqual: isEqual,
  navigationCheck: true,
  subscription: {
    values: true,
    pristine: true,
    invalid: true,
  },
})(FolioCirculationUserForm);
