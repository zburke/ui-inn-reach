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
  Row,
  Selection,
} from '@folio/stripes-components';
import {
  PATRON_AGENCY_FIELDS,
} from '../../../../../../constants';
import TabularListTitles from './components/TabularListTitles';
import css from '../../../../MaterialType/components/MaterialTypeMappingList/MaterialTypeMappingList.css';

const {
  USER_CUSTOM_FIELD_MAPPINGS,
  CUSTOM_FIELD_VALUE,
  AGENCY_CODE,
} = PATRON_AGENCY_FIELDS;

const TabularList = ({
  agencyCodeOptions,
}) => {
  const { formatMessage } = useIntl();

  return (
    <form>
      <Col sm={12}>
        <TabularListTitles />
        <FieldArray
          isEqual={isEqual}
          name={USER_CUSTOM_FIELD_MAPPINGS}
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
                    id={`${name}.${CUSTOM_FIELD_VALUE}-${index}`}
                    name={`${name}.${CUSTOM_FIELD_VALUE}`}
                    component={({ input }) => input.value}
                  />
                </Col>
                <Col
                  sm={6}
                  className={css.tabularCol}
                >
                  <Field
                    marginBottom0
                    id={`${name}.${AGENCY_CODE}-${index}`}
                    name={`${name}.${AGENCY_CODE}`}
                    aria-label={formatMessage({ id: 'ui-inn-reach.settings.patron-agency.field.agency-code' })}
                    placeholder={formatMessage({ id: 'ui-inn-reach.settings.patron-agency.placeholder.agency-code' })}
                    component={Selection}
                    dataOptions={agencyCodeOptions}
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
  agencyCodeOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TabularList;
