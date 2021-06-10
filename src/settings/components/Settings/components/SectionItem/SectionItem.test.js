import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import {
  renderWithIntl,
} from '@folio/stripes-data-transfer-components/test/jest/helpers';

import { translationsProperties } from '../../../../../../test/jest/helpers';
import SectionItem from './SectionItem';

jest.mock('@folio/stripes/core', () => ({
  IfInterface: () => 'IfInterface',
  IfPermission: () => 'IfPermission',
}));

const renderSectionItem = ({ setting, path }) => {
  const history = createMemoryHistory();

  return renderWithIntl(
    <Router history={history}>
      <SectionItem
        setting={setting}
        path={path}
      />
    </Router>,
    translationsProperties,
  );
};

describe('Settings SectionItem', () => {
  let sectionItem;

  describe('vanilla', () => {
    beforeEach(() => {
      sectionItem = renderSectionItem({
        setting: {
          route: 'some-route',
          label: 'foo',
          component: <div />,
        },
        path: 'funky-chicken',
      });
    });

    it('should be rendered', () => {
      const { container, getByTestId } = sectionItem;

      expect(container).toBeVisible();
      expect(getByTestId('section-item')).toBeVisible();
    });
  });

  describe('with interface present', () => {
    beforeEach(() => {
      sectionItem = renderSectionItem({
        setting: {
          route: 'some-route',
          label: 'foo',
          component: <div />,
          interface: 'interface',
        },
        path: 'funky-chicken'
      });
    });

    it('should be rendered', () => {
      const { container, getByText } = sectionItem;

      expect(container).toBeVisible();
      expect(getByText('IfInterface')).toBeDefined();
    });
  });

  describe('with interface absent', () => {
    beforeEach(() => {
      sectionItem = renderSectionItem({
        setting: {
          route: 'some-route',
          label: 'foo',
          component: <div />,
          interface: 'asdf',
        },
        path: 'funky-chicken'
      });
    });

    it('should not be rendered', () => {
      const { container, queryByTestId } = sectionItem;

      expect(container).toBeVisible();
      expect(queryByTestId('section-item')).toBeNull();
    });
  });

  describe('with permissions present', () => {
    beforeEach(() => {
      sectionItem = renderSectionItem({
        setting: {
          route: 'some-route',
          label: 'foo',
          component: <div />,
          perm: 'permission',
        },
        path: 'funky-chicken'
      });
    });

    it('should be rendered', () => {
      const { container, getByText } = sectionItem;

      expect(container).toBeVisible();
      expect(getByText('IfPermission')).toBeDefined();
    });
  });

  describe('with permissions absent', () => {
    beforeEach(() => {
      sectionItem = renderSectionItem({
        setting: {
          route: 'some-route',
          label: 'foo',
          component: <div />,
          perm: 'asdf',
        },
        path: 'funky-chicken'
      });
    });

    it('should not be rendered', () => {
      const { container, queryByTestId } = sectionItem;

      expect(container).toBeVisible();
      expect(queryByTestId('section-item')).toBeNull();
    });
  });
});
