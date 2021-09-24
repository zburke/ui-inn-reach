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
  MessageBanner,
} from '@folio/stripes-components';
import stripesFinalForm from '@folio/stripes/final-form';

import {
  DEFAULT_PANE_WIDTH,
  CENTRAL_SERVER_ID,
  BANNER_ERROR_TYPE,
  MATERIAL_TYPE_FIELDS,
} from '../../../../constants';
import {
  TableStyleList,
} from '../../common';
import {
  required,
} from '../../../../utils';

const {
  MATERIAL_TYPE_MAPPING_LIST,
  CENTRAL_ITEM_TYPE,
  MATERIAL_TYPE_LABEL,
} = MATERIAL_TYPE_FIELDS;

const MaterialTypeForm = ({
  selectedServer,
  isPending,
  isPristine,
  invalid,
  isServersPending,
  serverOptions,
  initialValues,
  innReachItemTypeOptions,
  isResetForm,
  handleSubmit,
  values,
  form,
  innReachItemTypesFailed,
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
        buttonStyle="primary mega"
        type="submit"
        disabled={isPristine || invalid}
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
      <form>
        <Row>
          <Col sm={12}>
            <Selection
              id={CENTRAL_SERVER_ID}
              label={<FormattedMessage id="ui-inn-reach.settings.field.centralServer" />}
              dataOptions={serverOptions}
              placeholder={formatMessage({ id: 'ui-inn-reach.settings.placeholder.centralServer' })}
              value={selectedServer.name}
              loading={isServersPending}
              onChange={onChangeServer}
            />
          </Col>
        </Row>
        {isPending && <Loading />}
        <MessageBanner
          type={BANNER_ERROR_TYPE}
          show={innReachItemTypesFailed}
        >
          <FormattedMessage id="ui-inn-reach.banner.item-types" />
        </MessageBanner>
        {selectedServer.id && !isPending && !innReachItemTypesFailed &&
          <TableStyleList
            requiredRightCol
            fieldArrayName={MATERIAL_TYPE_MAPPING_LIST}
            leftTitle={<FormattedMessage id="ui-inn-reach.settings.material-type-mapping.field.folio-material-types" />}
            rightTitle={<FormattedMessage id="ui-inn-reach.settings.material-type-mapping.field.item-type" />}
            leftFieldName={MATERIAL_TYPE_LABEL}
            rightFieldName={CENTRAL_ITEM_TYPE}
            dataOptions={innReachItemTypeOptions}
            ariaLabel={<FormattedMessage id="ui-inn-reach.settings.material-type-mapping.field.item-type" />}
            validate={required}
          />
        }
      </form>
    </Pane>
  );
};

MaterialTypeForm.propTypes = {
  form: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  innReachItemTypeOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  innReachItemTypesFailed: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
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
    invalid: true,
  },
  initialValuesEqual: (a, b) => isEqual(a, b),
})(MaterialTypeForm);
