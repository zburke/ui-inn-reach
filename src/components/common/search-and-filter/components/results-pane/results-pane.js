import React, {
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ExpandFilterPaneButton } from '@folio/stripes/smart-components';
import {
  Pane,
  PaneMenu,
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';

import {
  APP_NAME,
  FILL_PANE_WIDTH,
  ICON_KEYS,
} from '../../../../../constants';

const ResultsPane = ({
  children,
  width,
  title,
  subTitle,
  count,
  renderLastMenu,
  toggleFiltersPane,
  isFiltersOpened,
  filters,
}) => {
  const paneSub = (
    <FormattedMessage
      id="stripes-smart-components.searchResultsCountHeader"
      values={{ count }}
    />
  );

  const renderResultsFirstMenu = () => {
    if (isFiltersOpened) {
      return null;
    }

    const filterCount = Object.keys(filters).length;

    return (
      <PaneMenu>
        <ExpandFilterPaneButton
          filterCount={filterCount}
          onClick={toggleFiltersPane}
        />
      </PaneMenu>
    );
  };

  const getAppIcon = useCallback(() => (
    <AppIcon
      app={APP_NAME}
      iconKey={ICON_KEYS.APP}
    />
  ), []);

  return (
    <Pane
      data-test-results-pane
      noOverflow
      appIcon={getAppIcon()}
      defaultWidth={width}
      firstMenu={renderResultsFirstMenu()}
      lastMenu={renderLastMenu && renderLastMenu()}
      padContent={false}
      paneSub={subTitle || paneSub}
      paneTitle={title}
    >
      {children}
    </Pane>
  );
};

ResultsPane.propTypes = {
  children: PropTypes.node.isRequired,
  filters: PropTypes.object.isRequired,
  isFiltersOpened: PropTypes.bool.isRequired,
  title: PropTypes.node.isRequired,
  count: PropTypes.number,
  renderLastMenu: PropTypes.func,
  subTitle: PropTypes.node,
  toggleFiltersPane: PropTypes.func,
  width: PropTypes.string,
};

ResultsPane.defaultProps = {
  width: FILL_PANE_WIDTH,
  subTitle: '',
  count: 0,
};

export default ResultsPane;
