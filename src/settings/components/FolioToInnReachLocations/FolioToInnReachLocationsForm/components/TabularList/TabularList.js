import React, {
  useEffect,
  useState,
} from 'react';
import { isEmpty } from 'lodash';
import { useIntl } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import {
  Col,
  Row,
  Selection,
} from '@folio/stripes-components';

import css from './TabularList.css';
import { FOLIO_TO_INN_REACH_LOCATIONS } from '../../../../../../constants';

const {
  INN_REACH_LOCATIONS,
  TABULAR_LIST,
} = FOLIO_TO_INN_REACH_LOCATIONS;

const TabularList = ({
  innReachLocations,
  leftColumnName,
}) => {
  const { formatMessage } = useIntl();
  const [innReachLocationOptions, setInnReachLocationOptions] = useState([]);

  useEffect(() => {
    if (!isEmpty(innReachLocations)) {
      const innReachLocationOpts = innReachLocations.map(({ code }) => ({
        value: code,
        label: code,
      }));

      setInnReachLocationOptions(innReachLocationOpts);
    }
  }, [innReachLocations]);

  return (
    <>
      <div>Title components</div>
      <FieldArray name={TABULAR_LIST}>
        {({ fields }) => fields.map((name, index) => (
          <Row
            key={index}
            className={css.SetRow}
          >
            <Col
              sm={6}
              className={css.SetCell}
            >
              <Field
                name={`${name}.${leftColumnName}`}
                component={({ input }) => input.value}
              />
            </Col>
            <Col
              sm={6}
              className={css.SetCell}
            >
              <Field
                required
                name={`${name}.${INN_REACH_LOCATIONS}`}
                aria-label={formatMessage({ id: 'ui-inn-reach.settings.folio-to-inn-reach-locations.field.inn-reach-locations' })}
                component={Selection}
                dataOptions={innReachLocationOptions}
              />
            </Col>
          </Row>
        ))
        }
      </FieldArray>
    </>
  );
};

export default TabularList;
