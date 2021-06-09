import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { IfInterface } from '@folio/stripes/core';
import {
  NavList,
  NavListSection,
  Pane,
  PaneBackLink,
} from '@folio/stripes-components';

import SectionItem from './components/SectionItem';
import {
  SETTINGS_PANE_WIDTH,
} from '../../../constants';

const Settings = ({
  sections,
  path,
  centralServers,
}) => {
  return (
    <Pane
      defaultWidth={SETTINGS_PANE_WIDTH}
      paneTitle={<FormattedMessage id="ui-inn-reach.meta.title" />}
      firstMenu={<PaneBackLink to="/settings" />}
    >
      <NavList>
        {sections.map((section, index) => {
          const sectionInner = (
            <NavListSection
              key={index}
              label={section.label}
              data-testid="settings"
            >
              {section.pages.map(setting => (
                <SectionItem
                  setting={setting}
                  path={path}
                  key={setting.route}
                  centralServers={centralServers}
                />
              ))}
            </NavListSection>
          );

          return section.interface
            ? (
              <IfInterface
                key={index}
                name={section.interface}
              >
                {sectionInner}
              </IfInterface>
            )
            : sectionInner;
        })}
      </NavList>
    </Pane>
  );
};

Settings.propTypes = {
  path: PropTypes.string.isRequired,
  sections: PropTypes.arrayOf(PropTypes.object).isRequired,
  centralServers: PropTypes.arrayOf(PropTypes.object),
};

export default Settings;
