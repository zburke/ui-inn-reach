import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import {
  Col,
  Row,
  Selection,
} from '@folio/stripes-components';

import { MATERIAL_TYPE_FIELDS } from '../../../../../constants';
import css from './MaterialTypeMappingList.css';

const {
  MATERIAL_TYPE_MAPPING_LIST,
  CENTRAL_ITEM_TYPE,
  MATERIAL_TYPE_ID,
  MATERIAL_TYPE_LABEL,
  ID,
} = MATERIAL_TYPE_FIELDS;

const MaterialTypeMappingList = ({
  innReachItemTypeOptions,
}) => {
  const { formatMessage } = useIntl();

  return (
    <Col sm={12}>
      <Row>
        <Col
          className={css.tabularHeaderCol}
          sm={6}
        >
          {formatMessage({ id: 'ui-inn-reach.settings.material-type-mapping.field.folio-material-types' })}
        </Col>
        <Col
          className={css.tabularHeaderCol}
          sm={6}
        >
          {formatMessage({ id: 'ui-inn-reach.settings.material-type-mapping.field.item-type' })}
        </Col>
      </Row>
      <FieldArray name={MATERIAL_TYPE_MAPPING_LIST}>
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
                  name={`${name}.${MATERIAL_TYPE_LABEL}`}
                  component={({ input }) => input.value}
                />
              </Col>
              <Col
                sm={6}
                className={css.tabularCol}
              >
                <Field
                  marginBottom0
                  name={`${name}.${CENTRAL_ITEM_TYPE}`}
                  aria-label={formatMessage({ id: 'ui-inn-reach.settings.material-type-mapping.field.item-type' })}
                  component={Selection}
                  dataOptions={innReachItemTypeOptions}
                />
              </Col>
            </Row>
          ));
        }}
      </FieldArray>
    </Col>
  );
};

MaterialTypeMappingList.propTypes = {
  innReachItemTypeOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default MaterialTypeMappingList;
