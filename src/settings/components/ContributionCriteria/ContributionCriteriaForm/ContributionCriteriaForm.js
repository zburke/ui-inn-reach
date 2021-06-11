import React, {
  useEffect,
  useState,
} from 'react';
import {
  isEmpty,
  isEqual,
} from 'lodash';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Col,
  MultiSelection,
  Pane,
  Row,
  Select,
} from '@folio/stripes-components';
import stripesFinalForm from '@folio/stripes/final-form';

import {
  CONTRIBUTION_CRITERIA,
  DEFAULT_PANE_WIDTH,
} from '../../../../constants';

import css from './ContributionCriteriaForm.css';

const ContributionCriteriaForm = ({
  folioLocations,
  statisticalCodes,
  statisticalCodeTypes,
  values,
  initialValues,
  isResetForm,
  form,
  serverSelection,
  handleSubmit,
  onChangeFormResetState,
  onChangePristineState,
  onFooter,
}) => {
  const [statisticalCodeOptions, setStatisticalCodeOptions] = useState([]);
  const [folioLocationOptions, setFolioLocationOptions] = useState([]);

  useEffect(() => {
    if (!isEmpty(folioLocationOptions)) {
      const folioLocationOpts = folioLocations.map(({ id, name }) => ({
        label: name,
        value: id,
      }));

      setFolioLocationOptions(folioLocationOpts);
    }
  }, [folioLocations]);

  useEffect(() => {
    if (!isEmpty(statisticalCodes) && !isEmpty(statisticalCodeTypes)) {
      const statisticalCodeOpts = statisticalCodes.map(stCode => {
        const codeTypeName = statisticalCodeTypes.find(stCodeType => stCode.statisticalCodeTypeId === stCodeType.id)?.name;
        const label = `${codeTypeName}: ${stCode.code} - ${stCode.name}`;
        const isOptionDisabled = [
          values[CONTRIBUTION_CRITERIA.CONTRIBUTE_BUT_SUPPRESS_ID],
          values[CONTRIBUTION_CRITERIA.DO_NOT_CONTRIBUTE_ID],
          values[CONTRIBUTION_CRITERIA.CONTRIBUTE_AS_SYSTEM_OWNED_ID],
        ].includes(stCode.id);

        return {
          label,
          value: stCode.id,
          disabled: isOptionDisabled,
        };
      });

      setStatisticalCodeOptions(statisticalCodeOpts);
    }
  }, [statisticalCodes, statisticalCodeTypes, values]);

  useEffect(() => {
    if (isResetForm) {
      form.reset();
      onChangeFormResetState(false);
    }
  }, [isResetForm]);

  useEffect(() => {
    onChangePristineState(isEqual(initialValues, values));
  }, [values]);

  return (
    <Pane
      defaultWidth={DEFAULT_PANE_WIDTH}
      footer={onFooter(handleSubmit)}
      paneTitle={<FormattedMessage id='ui-inn-reach.settings.contribution-criteria.title' />}
    >
      {serverSelection}
      <form>
        <Row>
          <Col sm={12}>
            <Field
              name={CONTRIBUTION_CRITERIA.LOCATIONS_IDS}
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
              name={CONTRIBUTION_CRITERIA.CONTRIBUTE_BUT_SUPPRESS_ID}
              component={Select}
              placeholder=" "
              dataOptions={statisticalCodeOptions}
              selectClass={css.selectControl}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <Field
              label={<FormattedMessage id="ui-inn-reach.settings.contribution-criteria.field.doNotContribute" />}
              name={CONTRIBUTION_CRITERIA.DO_NOT_CONTRIBUTE_ID}
              component={Select}
              placeholder=" "
              dataOptions={statisticalCodeOptions}
              selectClass={css.selectControl}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <Field
              label={<FormattedMessage id="ui-inn-reach.settings.contribution-criteria.field.contributeAsSystemOwned" />}
              name={CONTRIBUTION_CRITERIA.CONTRIBUTE_AS_SYSTEM_OWNED_ID}
              component={Select}
              placeholder=" "
              dataOptions={statisticalCodeOptions}
              selectClass={css.selectControl}
            />
          </Col>
        </Row>
      </form>
    </Pane>
  );
};

ContributionCriteriaForm.propTypes = {
  form: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  isResetForm: PropTypes.bool.isRequired,
  serverSelection: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  onChangePristineState: PropTypes.func.isRequired,
  onChangeFormResetState: PropTypes.func.isRequired,
  onFooter: PropTypes.func.isRequired,
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
