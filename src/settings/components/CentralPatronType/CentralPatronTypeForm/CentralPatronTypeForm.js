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
} from '../../../../constants';
import TabularList from './components/TabularList';

const CentralPatronTypeForm = ({
  selectedServer,
  serverOptions,
  patronTypeOptions,
  isPatronTypeMappingsPending,
  isPatronTypesPending,
  patronTypesFailed,
  handleSubmit,
  pristine,
  invalid,
  onChangeServer,
}) => {
  const { formatMessage } = useIntl();

  const getFooter = () => {
    const saveButton = (
      <Button
        marginBottom0
        buttonStyle="primary mega"
        type="submit"
        disabled={pristine || invalid}
        onClick={handleSubmit}
      >
        <FormattedMessage id="ui-inn-reach.settings.central-patron-type.button.save" />
      </Button>
    );

    return <PaneFooter renderEnd={saveButton} />;
  };

  return (
    <Pane
      defaultWidth={DEFAULT_PANE_WIDTH}
      footer={getFooter()}
      paneTitle={<FormattedMessage id='ui-inn-reach.settings.central-patron-type.title' />}
    >
      <Row>
        <Col sm={12}>
          <Selection
            id={CENTRAL_SERVER_ID}
            label={<FormattedMessage id="ui-inn-reach.settings.central-patron-type.field.central-server" />}
            dataOptions={serverOptions}
            placeholder={formatMessage({ id: 'ui-inn-reach.settings.central-patron-type.placeholder.central-server' })}
            value={selectedServer.name}
            onChange={onChangeServer}
          />
        </Col>
      </Row>
      {isPatronTypeMappingsPending && <Loading />}
      <MessageBanner
        type={BANNER_ERROR_TYPE}
        show={patronTypesFailed}
      >
        <FormattedMessage id="ui-inn-reach.banner.patron-types" />
      </MessageBanner>
      {selectedServer.id && !isPatronTypeMappingsPending && !isPatronTypesPending && !patronTypesFailed &&
      <form>
        <TabularList patronTypeOptions={patronTypeOptions} />
      </form>
      }
    </Pane>
  );
};

CentralPatronTypeForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  isPatronTypeMappingsPending: PropTypes.bool.isRequired,
  isPatronTypesPending: PropTypes.bool.isRequired,
  patronTypeOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  patronTypesFailed: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  selectedServer: PropTypes.object.isRequired,
  serverOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChangeServer: PropTypes.func.isRequired,
};

export default stripesFinalForm({
  initialValuesEqual: isEqual,
  navigationCheck: true,
  subscription: {
    pristine: true,
    invalid: true,
  },
})(CentralPatronTypeForm);
