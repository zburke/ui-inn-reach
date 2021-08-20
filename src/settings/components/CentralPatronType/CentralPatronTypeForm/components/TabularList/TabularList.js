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
  CENTRAL_PATRON_TYPE_FIELDS,
} from '../../../../../../constants';
import {
  validatePatronType,
} from './utils';
import css from '../../../../MaterialType/components/MaterialTypeMappingList/MaterialTypeMappingList.css';

const {
  PATRON_TYPE_MAPPINGS,
  PATRON_GROUP_LABEL,
  PATRON_GROUP_ID,
  PATRON_TYPE,
} = CENTRAL_PATRON_TYPE_FIELDS;

const TabularList = ({
  patronTypeOptions,
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
            {formatMessage({ id: 'ui-inn-reach.settings.central-patron-type.field.folio-patron-groups' })}
          </Label>
        </Col>
        <Col
          className={css.tabularHeaderCol}
          sm={6}
        >
          <Label required>
            {formatMessage({ id: 'ui-inn-reach.settings.central-patron-type.field.patron-type' })}
          </Label>
        </Col>
      </Row>
      <FieldArray
        isEqual={isEqual}
        name={PATRON_TYPE_MAPPINGS}
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
                  id={`${name}.${PATRON_GROUP_ID}-${index}`}
                  name={`${name}.${PATRON_GROUP_LABEL}`}
                  component={({ input }) => input.value}
                />
              </Col>
              <Col
                sm={6}
                className={css.tabularCol}
              >
                <Field
                  marginBottom0
                  id={`${name}.${PATRON_TYPE}-${index}`}
                  name={`${name}.${PATRON_TYPE}`}
                  aria-label={formatMessage({ id: 'ui-inn-reach.settings.central-patron-type.field.patron-type' })}
                  component={Selection}
                  dataOptions={patronTypeOptions}
                  validate={validatePatronType}
                />
              </Col>
            </Row>
          ));
        }}
      </FieldArray>
    </Col>
  );
};

TabularList.propTypes = {
  patronTypeOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TabularList;
