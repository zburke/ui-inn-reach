import React, {
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { IfInterface } from '@folio/stripes/core';
import {
  NavList,
  NavListSection,
  Pane,
  PaneBackLink,
} from '@folio/stripes-components';

import SectionItem from './components/SectionItem';
import {
  SETTINGS_PANE_WIDTH, SETTINGS_PATH,
} from '../../../constants';

const Settings = ({
  sections,
  path,
  location,
}) => {
  const { formatMessage } = useIntl();
  const [activeLink, setActiveLink] = useState('');

  return (
    <Pane
      defaultWidth={SETTINGS_PANE_WIDTH}
      paneTitle={<FormattedMessage id="ui-inn-reach.meta.title" />}
      firstMenu={<PaneBackLink to="/settings" />}
    >
      {sections.map((section, index) => {
        const label = formatMessage({ id: section.label });

        const sectionInner = (
          <NavList
            tabIndex="0"
            key={index}
            aria-label={label}
          >
            <NavListSection
              label={label}
              data-testid="settings"
              activeLink={activeLink}
            >
              {section.pages.map(setting => {
                const { pathname } = location;
                const link = `${path}/${setting.route}`;

                if (pathname.endsWith(SETTINGS_PATH) && !!activeLink) {
                  setActiveLink('');
                } else if (pathname.startsWith(link) && activeLink !== link) {
                  setActiveLink(link);
                }

                return (
                  <SectionItem
                    setting={setting}
                    path={path}
                    key={setting.route}
                  />
                );
              })}
            </NavListSection>
          </NavList>
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
    </Pane>
  );
};

Settings.propTypes = {
  location: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  sections: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Settings;
