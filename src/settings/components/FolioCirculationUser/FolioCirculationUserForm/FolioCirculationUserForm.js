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
  CENTRAL_PATRON_TYPE_MAPPINGS,
  BARCODE,
} = FOLIO_CIRCULATION_USER_FIELDS;

const FolioCirculationUserForm = ({
  selectedServer,
  serverOptions,
  isCentralPatronTypeMappingsPending,
  isInnReachPatronTypesPending,
  innReachPatronTypesFailed,
  handleSubmit,
  parentMutator,
  pristine,
  values,
  form,
  onChangeServer,
}) => {
  const { formatMessage } = useIntl();
  const showTabularList = (
    selectedServer.id && !isCentralPatronTypeMappingsPending && !isInnReachPatronTypesPending && !innReachPatronTypesFailed
  );

  const getFooter = () => {
    const isAllFieldsFilledIn = values[CENTRAL_PATRON_TYPE_MAPPINGS]?.every(field => field[BARCODE]);

    const saveButton = (
      <Button
        marginBottom0
        buttonStyle="primary mega"
        type="submit"
        disabled={pristine || !isAllFieldsFilledIn}
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
      {isCentralPatronTypeMappingsPending && <Loading />}
      <MessageBanner
        type={BANNER_ERROR_TYPE}
        show={innReachPatronTypesFailed}
      >
        <FormattedMessage id="ui-inn-reach.banner.patron-types" />
      </MessageBanner>
      {showTabularList &&
        <TabularList
          form={form}
          parentMutator={parentMutator}
        />
      }
    </Pane>
  );
};

FolioCirculationUserForm.propTypes = {
  form: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  innReachPatronTypesFailed: PropTypes.bool.isRequired,
  isCentralPatronTypeMappingsPending: PropTypes.bool.isRequired,
  isInnReachPatronTypesPending: PropTypes.bool.isRequired,
  parentMutator: PropTypes.object.isRequired,
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
  },
})(FolioCirculationUserForm);
