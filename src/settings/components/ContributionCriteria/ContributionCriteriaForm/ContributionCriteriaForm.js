import React, {
  useEffect,
  useMemo,
} from 'react';
import {
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
  Select,
  Selection,
  Loading,
} from '@folio/stripes-components';
import stripesFinalForm from '@folio/stripes/final-form';

import {
  CONTRIBUTION_CRITERIA,
  DEFAULT_PANE_WIDTH,
} from '../../../../constants';

import css from './ContributionCriteriaForm.css';
import {
  getFolioLocations,
  getStatisticalCodeOptions,
} from './utils';

const {
  CENTRAL_SERVER_ID,
  LOCATIONS_IDS,
  CONTRIBUTE_BUT_SUPPRESS_ID,
  DO_NOT_CONTRIBUTE_ID,
  CONTRIBUTE_AS_SYSTEM_OWNED_ID,
} = CONTRIBUTION_CRITERIA;

const ContributionCriteriaForm = ({
  selectedServer,
  contributionCriteria,
  isContributionCriteriaPending,
  isPristine,
  serverOptions,
  initialValues,
  folioLocations,
  statisticalCodes,
  statisticalCodeTypes,
  isResetForm,
  handleSubmit,
  values,
  form,
  onChangePristineState,
  onChangeFormResetState,
  onChangeServer,
}) => {
  const { formatMessage } = useIntl();
  const folioLocationOptions = useMemo(() => getFolioLocations(folioLocations), [folioLocations]);
  const statisticalCodeOptions = useMemo(() => {
    return getStatisticalCodeOptions(formatMessage, values, statisticalCodes, statisticalCodeTypes);
  }, [statisticalCodes, statisticalCodeTypes, formatMessage, values]);

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
        <FormattedMessage id="ui-inn-reach.settings.contribution-criteria.button.save" />
      </Button>
    );

    return <PaneFooter renderEnd={saveButton} />;
  };

  return (
    <Pane
      defaultWidth={DEFAULT_PANE_WIDTH}
      footer={getFooter()}
      paneTitle={<FormattedMessage id='ui-inn-reach.settings.contribution-criteria.title' />}
    >
      <Row>
        <Col sm={12}>
          <Selection
            id={CENTRAL_SERVER_ID}
            label={<FormattedMessage id="ui-inn-reach.settings.contribution-criteria.field.centralServer" />}
            dataOptions={serverOptions}
            placeholder={formatMessage({ id: 'ui-inn-reach.settings.contribution-criteria.placeholder.centralServer' })}
            value={selectedServer.name}
            onChange={onChangeServer}
          />
        </Col>
      </Row>
      {isContributionCriteriaPending && <Loading />}
      {selectedServer.id && !isContributionCriteriaPending && contributionCriteria &&
        <form>
          <Row>
            <Col sm={12}>
              <Field
                name={LOCATIONS_IDS}
                component={MultiSelection}
                dataOptions={folioLocationOptions}
                label={<FormattedMessage id="ui-inn-reach.settings.contribution-criteria.field.locations" />}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <Field
                label={<FormattedMessage id="ui-inn-reach.settings.contribution-criteria.field.contributeButSuppress" />}
                name={CONTRIBUTE_BUT_SUPPRESS_ID}
                component={Select}
                dataOptions={statisticalCodeOptions}
                selectClass={css.selectControl}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <Field
                label={<FormattedMessage id="ui-inn-reach.settings.contribution-criteria.field.doNotContribute" />}
                name={DO_NOT_CONTRIBUTE_ID}
                component={Select}
                dataOptions={statisticalCodeOptions}
                selectClass={css.selectControl}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <Field
                label={<FormattedMessage id="ui-inn-reach.settings.contribution-criteria.field.contributeAsSystemOwned" />}
                name={CONTRIBUTE_AS_SYSTEM_OWNED_ID}
                component={Select}
                dataOptions={statisticalCodeOptions}
                selectClass={css.selectControl}
              />
            </Col>
          </Row>
        </form>
      }
    </Pane>
  );
};

ContributionCriteriaForm.propTypes = {
  form: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  isContributionCriteriaPending: PropTypes.bool.isRequired,
  isPristine: PropTypes.bool.isRequired,
  isResetForm: PropTypes.bool.isRequired,
  selectedServer: PropTypes.object.isRequired,
  serverOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  values: PropTypes.object.isRequired,
  onChangeFormResetState: PropTypes.func.isRequired,
  onChangePristineState: PropTypes.func.isRequired,
  onChangeServer: PropTypes.func.isRequired,
  contributionCriteria: PropTypes.object,
  folioLocations: PropTypes.arrayOf(PropTypes.object),
  statisticalCodeTypes: PropTypes.arrayOf(PropTypes.object),
  statisticalCodes: PropTypes.arrayOf(PropTypes.object),
};

export default stripesFinalForm({
  subscription: {
    values: true,
  },
  initialValuesEqual: (a, b) => isEqual(a, b),
})(ContributionCriteriaForm);
