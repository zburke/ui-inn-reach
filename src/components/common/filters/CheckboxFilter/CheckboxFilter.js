import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import { CheckboxFilter as Checkbox } from '@folio/stripes/smart-components';

import { handleClearFilter } from '../../../../utils';

const CheckboxFilter = ({
  activeFilters,
  closedByDefault,
  id,
  labelId,
  name,
  onChange,
  options = [],
}) => (
  <Accordion
    closedByDefault={closedByDefault}
    displayClearButton={activeFilters.length > 0}
    header={FilterAccordionHeader}
    id={id}
    label={<FormattedMessage id={labelId} />}
    onClearFilter={handleClearFilter(onChange, name)}
  >
    <Checkbox
      dataOptions={options}
      name={name}
      selectedValues={activeFilters}
      onChange={onChange}
    />
  </Accordion>
);

CheckboxFilter.propTypes = {
  id: PropTypes.string.isRequired,
  labelId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  activeFilters: PropTypes.array,
  closedByDefault: PropTypes.bool
};

CheckboxFilter.defaultProps = {
  activeFilters: [],
  closedByDefault: false
};

export default CheckboxFilter;
