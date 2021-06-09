import React from 'react';
import {
  IfInterface,
  IfPermission,
} from '@folio/stripes/core';
import {
  NavListItem,
} from '@folio/stripes-components';

const SectionItem = ({ setting, path, centralServers }) => {
  let sectionItem = (
    <NavListItem
      to={{
        pathname: `${path}/${setting.route}`,
        state: {
          centralServers,
        },
      }}
      data-testid="section-item"
    >
      {setting.label}
    </NavListItem>
  );

  if (setting.interface) {
    sectionItem = (
      <IfInterface name={setting.interface}>
        {sectionItem}
      </IfInterface>
    );
  }

  if (setting.perm) {
    sectionItem = (
      <IfPermission
        key={setting.route}
        perm={setting.perm}
      >
        {sectionItem}
      </IfPermission>
    );
  }

  return sectionItem;
};

export default SectionItem;
