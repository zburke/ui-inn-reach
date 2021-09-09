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
  TextField,
} from '@folio/stripes-components';
import {
  Pluggable,
} from '@folio/stripes/core';
import {
  FOLIO_CIRCULATION_USER_FIELDS,
} from '../../../../../../constants';
import {
  validateBarcode,
} from './utils';
import css from './TabularList.css';

const {
  CENTRAL_PATRON_TYPE_MAPPINGS,
  CENTRAL_PATRON_TYPE,
  CENTRAL_PATRON_TYPE_LABEL,
  BARCODE,
} = FOLIO_CIRCULATION_USER_FIELDS;

const TabularList = ({
  form,
  existingBarcodesSet,
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
              {formatMessage({ id: 'ui-inn-reach.settings.folio-circulation-user.field.patron-type' })}
            </Label>
          </Col>
          <Col
            className={css.tabularHeaderCol}
            sm={6}
          >
            <Label required>
              {formatMessage({ id: 'ui-inn-reach.settings.folio-circulation-user.field.barcode' })}
            </Label>
          </Col>
        </Row>
        <FieldArray
          isEqual={isEqual}
          name={CENTRAL_PATRON_TYPE_MAPPINGS}
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
                    id={`${name}.${CENTRAL_PATRON_TYPE}-${index}`}
                    name={`${name}.${CENTRAL_PATRON_TYPE_LABEL}`}
                    component={({ input }) => input.value}
                  />
                </Col>
                <Col
                  sm={6}
                  className={css.tabularCol}
                >
                  <Field
                    name={`${name}.${BARCODE}`}
                    validate={validateBarcode(existingBarcodesSet)}
                  >
                    {({ input, meta }) => (
                      <TextField
                        {...input}
                        marginBottom0
                        id={`${name}.${BARCODE}-${index}`}
                        aria-label={formatMessage({ id: 'ui-inn-reach.settings.folio-circulation-user.field.barcode' })}
                        error={meta.submitFailed ? meta.error : undefined}
                      />
                    )}
                  </Field>
                  <Pluggable
                    marginTop0
                    marginBottom0
                    type="find-user"
                    aria-haspopup="true"
                    searchLabel={formatMessage({ id: 'ui-inn-reach.patron-lookup' })}
                    searchButtonStyle="link"
                    selectUser={user => form.change(`${name}.${BARCODE}`, user.barcode)}
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
  existingBarcodesSet: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
};

export default TabularList;
