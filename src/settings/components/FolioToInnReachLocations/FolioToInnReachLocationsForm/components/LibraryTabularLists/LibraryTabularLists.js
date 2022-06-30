import {
  Field,
} from 'react-final-form';
import {
  FormattedMessage,
} from 'react-intl';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import {
  Selection,
  Headline,
  Row,
  Col,
} from '@folio/stripes-components';

import {
  TableStyleList,
} from '../../../../common';
import {
  getUniqueLocations,
} from '../../utils';
import {
  required,
} from '../../../../../../utils';
import {
  FOLIO_TO_INN_REACH_LOCATION_FIELDS,
  LOCAL_AGENCIES_FIELDS,
} from '../../../../../../constants';
import css from './LibraryTabularLists.css';

const {
  CODE,
} = LOCAL_AGENCIES_FIELDS;

const {
  INN_REACH_LOCATIONS,
  FOLIO_LIBRARY,
  LIBRARIES_TABULAR_LIST,
} = FOLIO_TO_INN_REACH_LOCATION_FIELDS;

const LibraryTabularLists = ({
  localAgencies,
  pickedLocationsByAgencyCode,
  innReachLocationOptions,
  formatMessage,
  onSetPickedLocations,
}) => {
  const handleLocationChange = (locId, index, fields, localAgencyCode) => {
    const prevLocId = fields.value[index][INN_REACH_LOCATIONS];
    const pickedLocations = pickedLocationsByAgencyCode[localAgencyCode];
    const prevLocationIndex = pickedLocations.findIndex(locationId => locationId === prevLocId);
    const updatedPickedLocations = {
      ...pickedLocationsByAgencyCode,
      [localAgencyCode]: [...pickedLocationsByAgencyCode[localAgencyCode], locId],
    };

    updatedPickedLocations[localAgencyCode].splice(prevLocationIndex, 1);
    onSetPickedLocations(updatedPickedLocations);

    const rowData = {
      ...fields.value[index],
      [INN_REACH_LOCATIONS]: locId,
    };

    fields.update(index, rowData);
  };

  return localAgencies.map((localAgency, index) => {
    const filteredInnReachLocationOptions = getUniqueLocations({
      innReachLocationOptions,
      pickedLocationsByAgencyCode,
      curLocalAgencyCode: localAgency[CODE],
    });

    return (
      <section key={`${localAgency[CODE]}${index}`}>
        <Headline
          tag="h2"
          margin="none"
          className={css.tabularListTitle}
        >
          {`${formatMessage({ id: 'ui-inn-reach.settings.folio-to-inn-reach-locations.list-title.local-agency-code' })}:
             ${localAgency[CODE]}`}
        </Headline>
        <TableStyleList
          requiredRightCol
          fieldArrayName={`${LIBRARIES_TABULAR_LIST}${index}`}
          rootClassName={css.tabularList}
          leftTitle={<FormattedMessage id="ui-inn-reach.settings.folio-to-inn-reach-locations.field.libraries" />}
          rightTitle={<FormattedMessage id="ui-inn-reach.settings.folio-to-inn-reach-locations.field.inn-reach-locations" />}
        >
          {({ fields }) => {
            return fields.map((name, i) => (
              <Row
                key={`${name}-${index}`}
                className={classNames(css.tabularRow, i % 2 ? css.tabularRowOdd : css.tabularRowEven)}
              >
                <Col
                  sm={6}
                  className={classNames(css.tabularCol, css.tabularColFirst)}
                >
                  <Field
                    id={`${name}.${FOLIO_LIBRARY}-${i}`}
                    name={`${name}.${FOLIO_LIBRARY}`}
                    component={({ input }) => input.value}
                  />
                </Col>
                <Col
                  sm={6}
                  className={css.tabularCol}
                >
                  <Field
                    marginBottom0
                    id={`${name}.${INN_REACH_LOCATIONS}-${i}`}
                    name={`${name}.${INN_REACH_LOCATIONS}`}
                    aria-label={<FormattedMessage id="ui-inn-reach.settings.folio-to-inn-reach-locations.field.inn-reach-locations" />}
                    component={Selection}
                    dataOptions={filteredInnReachLocationOptions}
                    validate={required}
                    onChange={locId => handleLocationChange(locId, i, fields, localAgency[CODE])}
                  />
                </Col>
              </Row>
            ));
          }}
        </TableStyleList>
      </section>
    );
  });
};

LibraryTabularLists.propTypes = {
  formatMessage: PropTypes.func.isRequired,
  innReachLocationOptions: PropTypes.array.isRequired,
  localAgencies: PropTypes.array.isRequired,
  pickedLocationsByAgencyCode: PropTypes.object.isRequired,
  onSetPickedLocations: PropTypes.func.isRequired,
};

export default LibraryTabularLists;
