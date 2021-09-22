import React from 'react';
import PropTypes from 'prop-types';
import {
  isEqual,
} from 'lodash';
import {
  Button,
  Loading,
  MessageBanner,
  Pane,
  PaneFooter,
  Selection,
} from '@folio/stripes-components';
import stripesFinalForm from '@folio/stripes/final-form';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  BANNER_ERROR_TYPE,
  CENTRAL_PATRON_TYPE_FIELDS,
  CENTRAL_SERVER_ID,
  DEFAULT_PANE_WIDTH,
} from '../../../../constants';
import {
  TableStyleList,
} from '../../common';

const {
  PATRON_TYPE_MAPPINGS,
  PATRON_GROUP_LABEL,
  PATRON_TYPE,
} = CENTRAL_PATRON_TYPE_FIELDS;

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
  const showTabularList = selectedServer.id && !isPatronTypeMappingsPending && !isPatronTypesPending && !patronTypesFailed;

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
      <form>
        <Selection
          id={CENTRAL_SERVER_ID}
          label={<FormattedMessage id="ui-inn-reach.settings.field.centralServer" />}
          dataOptions={serverOptions}
          placeholder={formatMessage({ id: 'ui-inn-reach.settings.placeholder.centralServer' })}
          value={selectedServer.name}
          onChange={onChangeServer}
        />
        {isPatronTypeMappingsPending && <Loading />}
        <MessageBanner
          type={BANNER_ERROR_TYPE}
          show={patronTypesFailed}
        >
          <FormattedMessage id="ui-inn-reach.banner.patron-types" />
        </MessageBanner>
        {showTabularList &&
          <TableStyleList
            requiredRightCol
            fieldArrayName={PATRON_TYPE_MAPPINGS}
            leftTitle={<FormattedMessage id="ui-inn-reach.settings.central-patron-type.field.folio-patron-groups" />}
            rightTitle={<FormattedMessage id="ui-inn-reach.settings.central-patron-type.field.patron-type" />}
            leftFieldName={PATRON_GROUP_LABEL}
            rightFieldName={PATRON_TYPE}
            dataOptions={patronTypeOptions}
            ariaLabel={<FormattedMessage id="ui-inn-reach.settings.central-patron-type.field.patron-type" />}
          />
        }
      </form>
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
