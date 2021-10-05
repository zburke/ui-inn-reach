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
  CENTRAL_ITEM_TYPE_FIELDS,
  CENTRAL_SERVER_ID,
  DEFAULT_PANE_WIDTH,
} from '../../../../constants';
import {
  TableStyleList,
} from '../../common';
import {
  required,
} from '../../../../utils';

const {
  ITEM_TYPE_MAPPINGS,
  ITEM_TYPE_LABEL,
  MATERIAL_TYPE_ID,
} = CENTRAL_ITEM_TYPE_FIELDS;

const CentralItemTypeForm = ({
  selectedServer,
  serverOptions,
  folioMaterialTypeOptions,
  isItemTypeMappingsPending,
  isInnReachItemTypesPending,
  innReachItemTypesFailed,
  handleSubmit,
  pristine,
  invalid,
  onChangeServer,
}) => {
  const { formatMessage } = useIntl();
  const showTabularList = selectedServer.id && !isItemTypeMappingsPending && !isInnReachItemTypesPending && !innReachItemTypesFailed;

  const getFooter = () => {
    const saveButton = (
      <Button
        marginBottom0
        buttonStyle="primary mega"
        type="submit"
        disabled={pristine || invalid}
        onClick={handleSubmit}
      >
        <FormattedMessage id="ui-inn-reach.settings.central-item-type.button.save" />
      </Button>
    );

    return <PaneFooter renderEnd={saveButton} />;
  };

  return (
    <Pane
      defaultWidth={DEFAULT_PANE_WIDTH}
      footer={getFooter()}
      paneTitle={<FormattedMessage id='ui-inn-reach.settings.central-item-type.title' />}
    >
      <Row>
        <Col sm={12}>
          <Selection
            id={CENTRAL_SERVER_ID}
            label={<FormattedMessage id="ui-inn-reach.settings.field.centralServer" />}
            dataOptions={serverOptions}
            placeholder={formatMessage({ id: 'ui-inn-reach.settings.placeholder.centralServer' })}
            value={selectedServer.name}
            onChange={onChangeServer}
          />
        </Col>
      </Row>
      {isItemTypeMappingsPending && <Loading />}
      <MessageBanner
        type={BANNER_ERROR_TYPE}
        show={innReachItemTypesFailed}
      >
        <FormattedMessage id="ui-inn-reach.banner.item-types" />
      </MessageBanner>
      {showTabularList &&
        <TableStyleList
          requiredRightCol
          fieldArrayName={ITEM_TYPE_MAPPINGS}
          leftTitle={<FormattedMessage id="ui-inn-reach.settings.central-item-type.field.item-type" />}
          rightTitle={<FormattedMessage id="ui-inn-reach.settings.central-item-type.field.folio-material-type" />}
          leftFieldName={ITEM_TYPE_LABEL}
          rightFieldName={MATERIAL_TYPE_ID}
          dataOptions={folioMaterialTypeOptions}
          ariaLabel={<FormattedMessage id="ui-inn-reach.settings.central-item-type.field.item-type" />}
          validate={required}
        />
      }
    </Pane>
  );
};

CentralItemTypeForm.propTypes = {
  folioMaterialTypeOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  innReachItemTypesFailed: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  isInnReachItemTypesPending: PropTypes.bool.isRequired,
  isItemTypeMappingsPending: PropTypes.bool.isRequired,
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
})(CentralItemTypeForm);
