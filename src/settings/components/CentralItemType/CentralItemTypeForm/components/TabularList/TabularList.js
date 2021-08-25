import React from 'react';
import {
  isEqual,
} from 'lodash';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import {
  Col,
  Label,
  Row,
  Selection,
} from '@folio/stripes-components';
import {
  CENTRAL_ITEM_TYPE_FIELDS,
} from '../../../../../../constants';
import {
  validateMaterialType,
} from './utils';
import css from '../../../../MaterialType/components/MaterialTypeMappingList/MaterialTypeMappingList.css';

const {
  ITEM_TYPE_MAPPINGS,
  ITEM_TYPE_LABEL,
  ITEM_TYPE,
  MATERIAL_TYPE_ID,
} = CENTRAL_ITEM_TYPE_FIELDS;

const TabularList = ({
  folioMaterialTypeOptions,
}) => {
  const { formatMessage } = useIntl();

  return (
    <form>
      <Col sm={12}>
        <Row>
          <Col
            className={css.tabularHeaderCol}
            sm={6}
          >
            <Label>
              {formatMessage({ id: 'ui-inn-reach.settings.central-item-type.field.item-type' })}
            </Label>
          </Col>
          <Col
            className={css.tabularHeaderCol}
            sm={6}
          >
            <Label required>
              {formatMessage({ id: 'ui-inn-reach.settings.central-item-type.field.folio-material-type' })}
            </Label>
          </Col>
        </Row>
        <FieldArray
          isEqual={isEqual}
          name={ITEM_TYPE_MAPPINGS}
        >
          {({ fields }) => {
            return fields.map((name, index) => (
              <Row
                key={index}
                className={css.tabularRow}
              >
                <Col
                  sm={6}
                  className={css.tabularCol}
                >
                  <Field
                    id={`${name}.${ITEM_TYPE}-${index}`}
                    name={`${name}.${ITEM_TYPE_LABEL}`}
                    component={({ input }) => input.value}
                  />
                </Col>
                <Col
                  sm={6}
                  className={css.tabularCol}
                >
                  <Field
                    marginBottom0
                    id={`${name}.${MATERIAL_TYPE_ID}-${index}`}
                    name={`${name}.${MATERIAL_TYPE_ID}`}
                    aria-label={formatMessage({ id: 'ui-inn-reach.settings.central-item-type.field.folio-material-type' })}
                    component={Selection}
                    dataOptions={folioMaterialTypeOptions}
                    validate={validateMaterialType}
                  />
                </Col>
              </Row>
            ));
          }}
        </FieldArray>
      </Col>
    </form>
  );
};

TabularList.propTypes = {
  folioMaterialTypeOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TabularList;
