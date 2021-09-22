import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Col,
  Row,
  Selection,
} from '@folio/stripes-components';
import {
  AGENCY_TO_FOLIO_LOCATIONS_FIELDS,
  NO_VALUE_OPTION_VALUE,
} from '../../../../../../constants';
import {
  getFolioLocationOptions,
} from '../../utils';
import {
  TableStyleList,
} from '../../../../common';
import css from './TabularList.css';

const {
  ID,
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
    const isNoValueOption = libId === NO_VALUE_OPTION_VALUE;
    const {
      id,
      libraryId,
      locationId,
    } = initialValues.agencyCodeMappings[index];

    const rowData = {
      [AGENCY]: fields.value[index][AGENCY],
    };

    if (!isNoValueOption) {
      rowData[LIBRARY_ID] = libId;
    }
    if (libraryId === libId) {
      rowData[LOCATION_ID] = locationId;
    }
    if (id) rowData[ID] = id;

    fields.update(index, rowData);
  };

  return (
    <TableStyleList
      fieldArrayName={AGENCY_CODE_MAPPINGS}
      leftTitle={<FormattedMessage id="ui-inn-reach.settings.agency-to-folio-locations.field.agency-code-description" />}
      rightTitle={<FormattedMessage id="ui-inn-reach.settings.agency-to-folio-locations.field.folio-library-and-location" />}
    >
      {({ fields }) => fields.map((name, index) => {
        const rowData = fields.value[index];
        const libraryId = rowData[LIBRARY_ID];
        const locationOptions = libraryId
          ? getFolioLocationOptions(folioLocationsMap, libraryId)
          : [];

        return (
          <Row
            key={index}
            className={index % 2 ? css.tabularRowOdd : css.tabularRowEven}
          >
            <Col
              sm={6}
              className={classNames(css.tabularCol, css.tabularColFirst)}
            >
              <Field
                id={`${name}.${AGENCY}${index}`}
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
                  id={`${name}.${LIBRARY_ID}-${index}`}
                  name={`${name}.${LIBRARY_ID}`}
                  aria-label={formatMessage({ id: 'ui-inn-reach.settings.agency-to-folio-locations.field.folio-library-and-location' })}
                  component={Selection}
                  dataOptions={librariesOptions}
                  placeholder={formatMessage({ id: 'ui-inn-reach.settings.agency-to-folio-locations.placeholder.folio-library' })}
                  onChange={libId => handleLibraryChange(libId, index, fields)}
                />
              </div>
              <Field
                marginBottom0
                id={`${name}.${LOCATION_ID}-${index}`}
                disabled={!libraryId}
                name={`${name}.${LOCATION_ID}`}
                aria-label={formatMessage({ id: 'ui-inn-reach.settings.agency-to-folio-locations.field.folio-library-and-location' })}
                component={Selection}
                dataOptions={locationOptions}
                placeholder={formatMessage({ id: 'ui-inn-reach.settings.agency-to-folio-locations.placeholder.folio-location' })}
              />
            </Col>
          </Row>
        );
      })}
    </TableStyleList>
  );
};

TabularList.propTypes = {
  folioLocationsMap: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  librariesOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TabularList;
