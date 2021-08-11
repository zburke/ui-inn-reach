import React from 'react';
import PropTypes from 'prop-types';
import {
  useIntl,
  FormattedMessage,
} from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import {
  Col,
  Row,
  Selection,
  Label,
} from '@folio/stripes-components';

import { MATERIAL_TYPE_FIELDS } from '../../../../../constants';
import css from './MaterialTypeMappingList.css';

const {
  MATERIAL_TYPE_MAPPING_LIST,
  CENTRAL_ITEM_TYPE,
  MATERIAL_TYPE_LABEL,
} = MATERIAL_TYPE_FIELDS;

const validate = (values) => {
  const errorArray = [];

  if (values) {
    values.forEach(({ centralItemType }) => {
      const errors = {};

      if (!centralItemType) {
        errors.centralItemType = <FormattedMessage id="ui-inn-reach.settings.validate.required" />;
      }
      errorArray.push(errors);
    });
  }

  return errorArray;
};

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
          <Label>
            {formatMessage({ id: 'ui-inn-reach.settings.material-type-mapping.field.folio-material-types' })}
          </Label>
        </Col>
        <Col
          className={css.tabularHeaderCol}
          sm={6}
        >
          <Label required>
            {formatMessage({ id: 'ui-inn-reach.settings.material-type-mapping.field.item-type' })}
          </Label>
        </Col>
      </Row>
      <FieldArray
        name={MATERIAL_TYPE_MAPPING_LIST}
        validate={validate}
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
