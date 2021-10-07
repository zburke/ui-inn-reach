import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { CollapseFilterPaneButton } from '@folio/stripes/smart-components';
import {
  Pane,
  PaneMenu,
} from '@folio/stripes/components';

import { FILTER_PANE_WIDTH } from '../../../../../constants';

const paneTitle = <FormattedMessage id="ui-inn-reach.searchAndFilter" />;

const FiltersPane = ({
  children,
  width,
  toggleFilters,
}) => {
  const lastMenu = (
    <PaneMenu>
      <CollapseFilterPaneButton onClick={toggleFilters} />
    </PaneMenu>
  );

  return (
    <Pane
      data-test-filter-pane
      defaultWidth={width}
      lastMenu={lastMenu}
      paneTitle={paneTitle}
    >
      {children}
    </Pane>
  );
};

FiltersPane.propTypes = {
  children: PropTypes.node.isRequired,
  toggleFilters: PropTypes.func.isRequired,
  width: PropTypes.string,
};

FiltersPane.defaultProps = {
  width: FILTER_PANE_WIDTH,
};

export default FiltersPane;
