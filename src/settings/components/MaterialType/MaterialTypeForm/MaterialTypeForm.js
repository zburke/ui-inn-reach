import React, {
  useEffect,
} from 'react';
import {
  isEqual,
} from 'lodash';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  Col,
  Pane,
  PaneFooter,
  Row,
  Selection,
  Loading,
} from '@folio/stripes-components';
import stripesFinalForm from '@folio/stripes/final-form';

import {
  MATERIAL_TYPE_FIELDS,
  DEFAULT_PANE_WIDTH,
} from '../../../../constants';
import { MaterialTypeMappingList } from '../components';

const {
  CENTRAL_SERVER_ID,
} = MATERIAL_TYPE_FIELDS;

const MaterialTypeForm = ({
  selectedServer,
  isPending,
  isPristine,
  isServersPending,
  serverOptions,
  initialValues,
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
      paneTitle={<FormattedMessage id='ui-inn-reach.settings.material-type-mapping.title' />}
    >
      <Row>
        <Col sm={12}>
          <Selection
            id={CENTRAL_SERVER_ID}
            label={<FormattedMessage id="ui-inn-reach.settings.material-type-mapping.field.centralServer" />}
            dataOptions={serverOptions}
            placeholder={formatMessage({ id: 'ui-inn-reach.settings.material-type-mapping.placeholder.centralServer' })}
            value={selectedServer.name}
            loading={isServersPending}
            onChange={onChangeServer}
          />
        </Col>
      </Row>
      {isPending && <Loading />}
      {selectedServer.id && !isPending &&
        <form>
          <MaterialTypeMappingList
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
  innReachItemTypeOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  isPending: PropTypes.bool.isRequired,
  isPristine: PropTypes.bool.isRequired,
  isResetForm: PropTypes.bool.isRequired,
  isServersPending: PropTypes.bool.isRequired,
  selectedServer: PropTypes.object.isRequired,
  serverOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  values: PropTypes.object.isRequired,
  onChangeFormResetState: PropTypes.func.isRequired,
  onChangePristineState: PropTypes.func.isRequired,
  onChangeServer: PropTypes.func.isRequired,
};

export default stripesFinalForm({
  subscription: {
    values: true,
  },
  initialValuesEqual: (a, b) => isEqual(a, b),
})(MaterialTypeForm);
