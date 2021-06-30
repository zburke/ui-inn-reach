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

import { FOLIO_TO_INN_REACH_LOCATION_FIELDS } from '../../../../../../constants';
import css from './TabularList.css';

const {
  INN_REACH_LOCATIONS,
  TABULAR_LIST,
  FOLIO_LIBRARY,
  FOLIO_LOCATION,
} = FOLIO_TO_INN_REACH_LOCATION_FIELDS;

const TabularList = ({
  innReachLocations,
  leftColumnName,
}) => {
  const { formatMessage } = useIntl();

  const innReachLocationOptions = innReachLocations.map(({ code }) => ({
    value: code,
    label: code,
  }));

  const validate = (value, allValues) => {
    const tabularList = allValues[TABULAR_LIST];
    const leftColName = tabularList[0][FOLIO_LIBRARY]
      ? FOLIO_LIBRARY
      : FOLIO_LOCATION;

    if (leftColName === FOLIO_LIBRARY) {
      return value
        ? undefined
        : formatMessage({ id: 'ui-inn-reach.settings.folio-to-inn-reach-locations.create-edit.validation.pleaseEnterAValue' });
    } else {
      const isSomeFieldFilledIn = tabularList.some(row => row[INN_REACH_LOCATIONS]);

      return value || isSomeFieldFilledIn
        ? undefined
        : formatMessage({ id: 'ui-inn-reach.settings.folio-to-inn-reach-locations.create-edit.validation.pleaseEnterAValue' });
    }
  };

  return (
    <Col sm={12}>
      <Row>
        <Col
          className={css.tabularHeaderCol}
          sm={6}
        >
          {leftColumnName === FOLIO_LIBRARY
            ? formatMessage({ id: 'ui-inn-reach.settings.folio-to-inn-reach-locations.field.libraries' })
            : formatMessage({ id: 'ui-inn-reach.settings.folio-to-inn-reach-locations.field.locations' })
          }
        </Col>
        <Col
          className={css.tabularHeaderCol}
          sm={6}
        >
          {formatMessage({ id: 'ui-inn-reach.settings.folio-to-inn-reach-locations.field.inn-reach-locations' })}
        </Col>
      </Row>
      <FieldArray name={TABULAR_LIST}>
        {({ fields }) => fields.map((name, index) => (
          <Row
            key={index}
            className={css.tabularRow}
          >
            <Col
              sm={6}
              className={css.tabularCol}
            >
              <Field
                name={`${name}.${leftColumnName}`}
                component={({ input }) => input.value}
              />
            </Col>
            <Col
              sm={6}
              className={css.tabularCol}
            >
              <Field
                marginBottom0
                name={`${name}.${INN_REACH_LOCATIONS}`}
                aria-label={formatMessage({ id: 'ui-inn-reach.settings.folio-to-inn-reach-locations.field.inn-reach-locations' })}
                component={Selection}
                dataOptions={innReachLocationOptions}
                validate={validate}
              />
            </Col>
          </Row>
        ))}
      </FieldArray>
    </Col>
  );
};

TabularList.propTypes = {
  innReachLocations: PropTypes.arrayOf(PropTypes.object).isRequired,
  leftColumnName: PropTypes.string.isRequired,
};

export default TabularList;
