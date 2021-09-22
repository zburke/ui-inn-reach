import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, useIntl } from 'react-intl';
import { Field } from 'react-final-form';
import {
  Col,
  Row,
  TextField,
} from '@folio/stripes-components';
import {
  Pluggable,
} from '@folio/stripes/core';
import {
  DebouncingValidatingField,
  TableStyleList,
} from '../../../../common';
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
  parentMutator,
}) => {
  const { formatMessage } = useIntl();

  const validateBarcodeValue = (value, allValues) => {
    const isAllFieldsFilledIn = allValues[CENTRAL_PATRON_TYPE_MAPPINGS].every(field => field[BARCODE]);

    return isAllFieldsFilledIn
      ? validateBarcode(value, allValues, parentMutator)
      : undefined;
  };

  return (
    <TableStyleList
      requiredRightCol
      fieldArrayName={CENTRAL_PATRON_TYPE_MAPPINGS}
      leftTitle={<FormattedMessage id="ui-inn-reach.settings.folio-circulation-user.field.patron-type" />}
      rightTitle={<FormattedMessage id="ui-inn-reach.settings.folio-circulation-user.field.barcode" />}
    >
      {({ fields }) => {
        return fields.map((name, index) => (
          <Row
            key={index}
            className={classNames(css.tabularRow, index % 2 ? css.tabularRowOdd : css.tabularRowEven)}
          >
            <Col
              sm={6}
              className={classNames(css.tabularCol, css.tabularColFirst)}
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
              <DebouncingValidatingField
                name={`${name}.${BARCODE}`}
                validate={validateBarcodeValue}
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
              </DebouncingValidatingField>
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
    </TableStyleList>
  );
};

TabularList.propTypes = {
  form: PropTypes.object.isRequired,
  parentMutator: PropTypes.object.isRequired,
};

export default TabularList;
