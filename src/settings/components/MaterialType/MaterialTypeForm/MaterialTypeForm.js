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
  Select,
  Selection,
  Loading,
} from '@folio/stripes-components';
import stripesFinalForm from '@folio/stripes/final-form';

import {
  CONTRIBUTION_CRITERIA,
  DEFAULT_PANE_WIDTH,
} from '../../../../constants';
import { MaterialTypeMappingList } from '../components'

import css from './MaterialTypeForm.css';

const {
  CENTRAL_SERVER_ID,
  MATERIAL_TYPE_MAPPING_LIST,
  CENTRAL_ITEM_TYPE,
  MATERIAL_TYPE_ID,
} = CONTRIBUTION_CRITERIA;

const MaterialTypeForm = ({
  selectedServer,
  isMaterialTypeMappingsPending,
  isPristine,
  serverOptions,
  initialValues,
  materialTypeOptions,
  innReachItemTypeOptions,
  isResetForm,
  handleSubmit,
  values,
  form,
  onChangePristineState,
  onChangeFormResetState,
  onChangeServer,
}) => {
  const { formatMessage } = useIntl();

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
        buttonStyle="primary small"
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
      {isMaterialTypeMappingsPending && <Loading />}
      {selectedServer.id && !isMaterialTypeMappingsPending &&
        <form>
          <MaterialTypeMappingList
            materialTypeOptions={materialTypeOptions}
            innReachItemTypeOptions={innReachItemTypeOptions}
          />
        </form>
      }
    </Pane>
  );
};

MaterialTypeForm.propTypes = {
  form: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  isMaterialTypeMappingsPending: PropTypes.bool.isRequired,
  isPristine: PropTypes.bool.isRequired,
  isResetForm: PropTypes.bool.isRequired,
  selectedServer: PropTypes.object.isRequired,
  serverOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  values: PropTypes.object.isRequired,
  onChangeFormResetState: PropTypes.func.isRequired,
  onChangePristineState: PropTypes.func.isRequired,
  onChangeServer: PropTypes.func.isRequired,
  materialTypeOptions: PropTypes.arrayOf(PropTypes.object),
  innReachItemTypeOptions: PropTypes.arrayOf(PropTypes.object),
};

export default stripesFinalForm({
  subscription: {
    values: true,
  },
  initialValuesEqual: (a, b) => isEqual(a, b),
})(MaterialTypeForm);
