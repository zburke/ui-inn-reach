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

import {
  AGENCY_TO_FOLIO_LOCATIONS_FIELDS,
} from '../../../../../../constants';
import {
  getFolioLocationOptions,
} from '../../utils';

import css from './TabularList.css';

const {
  AGENCY,
  LIBRARY_ID,
  LOCATION_ID,
  AGENCY_CODE_MAPPINGS,
} = AGENCY_TO_FOLIO_LOCATIONS_FIELDS;

const TabularList = ({
  initialValues,
  librariesOptions,
  folioLocationsMap,
}) => {
  const { formatMessage } = useIntl();

  const handleLibraryChange = (libId, index, fields) => {
    const {
      id,
      libraryId,
      locationId,
    } = initialValues.agencyCodeMappings[index];

    const rowData = {
      [AGENCY]: fields.value[index][AGENCY],
      [LIBRARY_ID]: libId,
    };

    if (libraryId === libId) {
      rowData[LOCATION_ID] = locationId;
    }
    if (id) {
      rowData.id = id;
    }

    fields.update(index, rowData);
  };

  return (
    <Col sm={12}>
      <Row>
        <Col
          className={css.tabularHeaderCol}
          sm={6}
        >
          {formatMessage({ id: 'ui-inn-reach.settings.agency-to-folio-locations.field.agency-code-description' })}
        </Col>
        <Col
          className={css.tabularHeaderCol}
          sm={6}
        >
          {formatMessage({ id: 'ui-inn-reach.settings.agency-to-folio-locations.field.folio-library-and-location' })}
        </Col>
      </Row>
      <FieldArray name={AGENCY_CODE_MAPPINGS}>
        {({ fields }) => fields.map((name, index) => {
          const rowData = fields.value[index];
          const libraryId = rowData[LIBRARY_ID];
          const locationOptions = libraryId
            ? getFolioLocationOptions(folioLocationsMap, libraryId)
            : [];

          return (
            <Row
              key={index}
              className={css.tabularRow}
            >
              <Col
                sm={6}
                className={css.tabularCol}
              >
                <Field
                  name={`${name}.${AGENCY}`}
                  component={({ input }) => input.value}
                />
              </Col>
              <Col
                sm={6}
                className={css.tabularCol}
              >
                <div className={css.topFieldWrapper}>
                  <Field
                    marginBottom0
                    name={`${name}.${LIBRARY_ID}`}
                    aria-label={formatMessage({ id: 'ui-inn-reach.settings.agency-to-folio-locations.placeholder.folio-library' })}
                    component={Selection}
                    dataOptions={librariesOptions}
                    onChange={libId => handleLibraryChange(libId, index, fields)}
                  />
                </div>
                <Field
                  marginBottom0
                  disabled={!libraryId}
                  name={`${name}.${LOCATION_ID}`}
                  aria-label={formatMessage({ id: 'ui-inn-reach.settings.agency-to-folio-locations.placeholder.folio-location' })}
                  component={Selection}
                  dataOptions={locationOptions}
                  placeholder={formatMessage({ id: 'ui-inn-reach.settings.agency-to-folio-locations.placeholder.folio-location' })}
                />
              </Col>
            </Row>
          );
        })}
      </FieldArray>
    </Col>
  );
};

TabularList.propTypes = {
  folioLocationsMap: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  librariesOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TabularList;
