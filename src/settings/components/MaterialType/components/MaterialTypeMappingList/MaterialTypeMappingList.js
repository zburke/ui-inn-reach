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
  MATERIAL_TYPE_LABEL
} = MATERIAL_TYPE_FIELDS;

const MaterialTypeMappingList = ({
  materialTypeOptions,
  innReachItemTypeOptions,
}) => {
  const { formatMessage } = useIntl();

  console.log('innReachItemTypeOptions', innReachItemTypeOptions);
  return (
    <Col sm={12}>
      <Row>
        <Col
          className={css.tabularHeaderCol}
          sm={6}
        >
          {formatMessage({ id: 'ui-inn-reach.settings.folio-to-inn-reach-locations.field.locations' })}
        </Col>
        <Col
          className={css.tabularHeaderCol}
          sm={6}
        >
          {formatMessage({ id: 'ui-inn-reach.settings.folio-to-inn-reach-locations.field.inn-reach-locations' })}
        </Col>
      </Row>
      <FieldArray name={MATERIAL_TYPE_MAPPING_LIST}>
        {({ fields }) => {
          console.log('fields', fields);
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
                <Field
                  name={`${name}.${MATERIAL_TYPE_ID}`}
                  component={({ input }) => null}
                />
              </Col>
              <Col
                sm={6}
                className={css.tabularCol}
              >
                <Field
                  marginBottom0
                  name={`${name}.${CENTRAL_ITEM_TYPE}`}
                  aria-label={formatMessage({ id: 'ui-inn-reach.settings.folio-to-inn-reach-locations.field.inn-reach-locations' })}
                  component={Selection}
                  dataOptions={innReachItemTypeOptions}
                />
              </Col>
            </Row>
          ))
        }}
      </FieldArray>
    </Col>
  );
};

MaterialTypeMappingList.propTypes = {
  materialTypeOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  innReachItemTypeOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default MaterialTypeMappingList;
