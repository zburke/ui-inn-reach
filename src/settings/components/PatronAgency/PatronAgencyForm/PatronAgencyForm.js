import React from 'react';
import PropTypes from 'prop-types';
import {
  isEqual,
} from 'lodash';
import {
  Field,
} from 'react-final-form';
import {
  Button,
  Loading,
  Pane,
  PaneFooter,
  Selection,
} from '@folio/stripes-components';
import stripesFinalForm from '@folio/stripes/final-form';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  CENTRAL_SERVER_ID,
  DEFAULT_PANE_WIDTH,
  PATRON_AGENCY_FIELDS,
} from '../../../../constants';
import {
  TableStyleList,
} from '../../common';
import {
  validate,
} from './utils';

const {
  CUSTOM_FIELD_ID,
  USER_CUSTOM_FIELD_MAPPINGS,
  CUSTOM_FIELD_VALUE,
  AGENCY_CODE,
} = PATRON_AGENCY_FIELDS;

const PatronAgencyForm = ({
  selectedServer,
  serverOptions,
  customFieldOptions,
  agencyCodeOptions,
  userCustomFieldMappings,
  isUserCustomFieldMappingsPending,
  handleSubmit,
  pristine,
  form,
  values,
  onChangeServer,
  onChangeCustomField,
}) => {
  const { formatMessage } = useIntl();
  const showTabularList = selectedServer.id && values[CUSTOM_FIELD_ID] && !isUserCustomFieldMappingsPending;

  const handleChangeCustomField = (customFieldId) => {
    onChangeCustomField(customFieldId);
    form.change(CUSTOM_FIELD_ID, customFieldId);
  };

  const getFooter = () => {
    const saveButton = (
      <Button
        marginBottom0
        buttonStyle="primary mega"
        type="submit"
        disabled={pristine}
        onClick={handleSubmit}
      >
        <FormattedMessage id="ui-inn-reach.settings.patron-agency.button.save" />
      </Button>
    );

    return <PaneFooter renderEnd={saveButton} />;
  };

  return (
    <Pane
      defaultWidth={DEFAULT_PANE_WIDTH}
      footer={getFooter()}
      paneTitle={<FormattedMessage id='ui-inn-reach.settings.patron-agency.title' />}
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
        {selectedServer.id && !isUserCustomFieldMappingsPending && userCustomFieldMappings &&
          <Field
            id={CUSTOM_FIELD_ID}
            name={CUSTOM_FIELD_ID}
            component={Selection}
            label={<FormattedMessage id="ui-inn-reach.settings.patron-agency.field.custom-field" />}
            dataOptions={customFieldOptions}
            onChange={handleChangeCustomField}
          />
        }
        {isUserCustomFieldMappingsPending && <Loading />}
        {showTabularList &&
          <TableStyleList
            fieldArrayName={USER_CUSTOM_FIELD_MAPPINGS}
            leftTitle={<FormattedMessage id="ui-inn-reach.settings.patron-agency.field.custom-field-value" />}
            rightTitle={<FormattedMessage id="ui-inn-reach.settings.patron-agency.field.agency-code" />}
            leftFieldName={CUSTOM_FIELD_VALUE}
            rightFieldName={AGENCY_CODE}
            dataOptions={agencyCodeOptions}
            ariaLabel={<FormattedMessage id="ui-inn-reach.settings.patron-agency.field.agency-code" />}
            validate={validate}
          />
        }
      </form>
    </Pane>
  );
};

PatronAgencyForm.propTypes = {
  agencyCodeOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  customFieldOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  form: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isUserCustomFieldMappingsPending: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  selectedServer: PropTypes.object.isRequired,
  serverOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  values: PropTypes.object.isRequired,
  onChangeCustomField: PropTypes.func.isRequired,
  onChangeServer: PropTypes.func.isRequired,
  userCustomFieldMappings: PropTypes.object,
};

export default stripesFinalForm({
  initialValuesEqual: isEqual,
  navigationCheck: true,
  subscription: {
    pristine: true,
    values: true,
  },
})(PatronAgencyForm);
