import React, {
  useEffect,
  useState,
} from 'react';
import {
  isEmpty,
  isEqual,
} from 'lodash';
import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  Col,
  MultiSelection,
  Pane,
  PaneFooter,
  Row,
  Selection,
  Loading,
} from '@folio/stripes-components';
import stripesFinalForm from '@folio/stripes/final-form';

import {
  CONTRIBUTION_OPTIONS_FIELDS,
  DEFAULT_PANE_WIDTH,
} from '../../../../constants';

const {
  CENTRAL_SERVER_ID,
  LOAN_TYPE_IDS,
  LOCATION_IDS,
  STATUSES,
  MATERIAL_TYPE_IDS,
} = CONTRIBUTION_OPTIONS_FIELDS;

const ContributionOptionsForm = ({
  selectedServer,
  isContributionOptionsPending,
  isPristine,
  isServersPending,
  serverOptions,
  statusesOptions,
  initialValues,
  folioLocations,
  materialTypes,
  loanTypes,
  isResetForm,
  handleSubmit,
  values,
  form,
  onChangePristineState,
  onChangeFormResetState,
  onChangeServer,
}) => {
  const { formatMessage } = useIntl();
  const [folioLocationOptions, setFolioLocationOptions] = useState([]);
  const [folioMaterialTypeOptions, setFolioMaterialTypeOptions] = useState([]);
  const [folioLoanTypeOptions, setFolioLoanTypeOptions] = useState([]);

  useEffect(() => {
    if (!isEmpty(materialTypes)) {
      const folioMaterialTypeOpts = materialTypes.map(({ id, name }) => ({
        label: name,
        value: id,
      }));

      setFolioMaterialTypeOptions(folioMaterialTypeOpts);
    }

    if (!isEmpty(folioLocations)) {
      const folioLocationOpts = folioLocations.map(({ id, name }) => ({
        label: name,
        value: id,
      }));

      setFolioLocationOptions(folioLocationOpts);
    }

    if (!isEmpty(loanTypes)) {
      const folioLoanTypeOpts = loanTypes.map(({ id, name }) => ({
        label: name,
        value: id,
      }));

      setFolioLoanTypeOptions(folioLoanTypeOpts);
    }
  }, [folioLocations, loanTypes, materialTypes]);

  useEffect(() => {
    if (isResetForm) {
      form.reset();
      onChangeFormResetState(false);
    }
  }, [isResetForm]);

  useEffect(() => {
    onChangePristineState(isEqual(initialValues, values));
  }, [values]);

  const getFooter = () => {
    const saveButton = (
      <Button
        marginBottom0
        data-testid="save-button"
        id="clickable-save-instance"
        buttonStyle="primary mega"
        type="submit"
        disabled={isPristine}
        onClick={handleSubmit}
      >
        <FormattedMessage id="ui-inn-reach.settings.contribution-options.button.save" />
      </Button>
    );

    return <PaneFooter renderEnd={saveButton} />;
  };

  return (
    <Pane
      defaultWidth={DEFAULT_PANE_WIDTH}
      footer={getFooter()}
      paneTitle={<FormattedMessage id='ui-inn-reach.settings.contribution-options.title' />}
    >
      <Row>
        <Col sm={12}>
          <Selection
            id={CENTRAL_SERVER_ID}
            label={<FormattedMessage id="ui-inn-reach.settings.contribution-options.field.centralServer" />}
            dataOptions={serverOptions}
            placeholder={formatMessage({ id: 'ui-inn-reach.settings.contribution-options.placeholder.centralServer' })}
            value={selectedServer.name}
            loading={isServersPending}
            onChange={onChangeServer}
          />
        </Col>
      </Row>
      {isContributionOptionsPending && <Loading />}
      {selectedServer.id && !isContributionOptionsPending &&
        <form>
          <Row>
            <Col sm={12}>
              <Field
                name={STATUSES}
                component={MultiSelection}
                dataOptions={statusesOptions}
                label={<FormattedMessage id="ui-inn-reach.settings.contribution-options.field.statuses" />}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <Field
                label={<FormattedMessage id="ui-inn-reach.settings.contribution-options.field.loanTypes" />}
                name={LOAN_TYPE_IDS}
                component={MultiSelection}
                dataOptions={folioLoanTypeOptions}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <Field
                name={LOCATION_IDS}
                component={MultiSelection}
                dataOptions={folioLocationOptions}
                label={<FormattedMessage id="ui-inn-reach.settings.contribution-options.field.locations" />}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <Field
                label={<FormattedMessage id="ui-inn-reach.settings.contribution-options.field.materialTypes" />}
                name={MATERIAL_TYPE_IDS}
                component={MultiSelection}
                dataOptions={folioMaterialTypeOptions}
              />
            </Col>
          </Row>
        </form>
      }
    </Pane>
  );
};

ContributionOptionsForm.propTypes = {
  form: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  isContributionOptionsPending: PropTypes.bool.isRequired,
  isPristine: PropTypes.bool.isRequired,
  isResetForm: PropTypes.bool.isRequired,
  isServersPending: PropTypes.bool.isRequired,
  selectedServer: PropTypes.object.isRequired,
  serverOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  statusesOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  values: PropTypes.object.isRequired,
  onChangeFormResetState: PropTypes.func.isRequired,
  onChangePristineState: PropTypes.func.isRequired,
  onChangeServer: PropTypes.func.isRequired,
  folioLocations: PropTypes.arrayOf(PropTypes.object),
  loanTypes: PropTypes.arrayOf(PropTypes.object),
  materialTypes: PropTypes.arrayOf(PropTypes.object),
};

export default stripesFinalForm({
  subscription: {
    values: true,
  },
  initialValuesEqual: (a, b) => isEqual(a, b),
})(ContributionOptionsForm);
