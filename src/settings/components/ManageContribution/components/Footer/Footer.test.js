import React from 'react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { screen } from '@testing-library/react';
import { translationsProperties } from '../../../../../../test/jest/helpers';
import Footer from './Footer';

jest.mock('@folio/stripes-components', () => ({
  ...jest.requireActual('@folio/stripes-components'),
  Tooltip: jest.fn(() => <div>Tooltip</div>),
}));

const renderFooter = ({
  currentContribution,
  onInitiateContribution,
  onCancelContribution,
} = {}) => {
  return renderWithIntl(
    <Footer
      currentContribution={currentContribution}
      onInitiateContribution={onInitiateContribution}
      onCancelContribution={onCancelContribution}
    />,
    translationsProperties,
  );
};

describe('Footer', () => {
  const onInitiateContribution = jest.fn();
  const onCancelContribution = jest.fn();

  const commonProps = {
    onInitiateContribution,
    onCancelContribution,
  };

  it('should be rendered', () => {
    const { container } = renderFooter({
      ...commonProps,
      currentContribution: { status: 'Not started' }
    });

    expect(container).toBeVisible();
  });

  describe('status "Not started"', () => {
    describe('"Initiate contribution" button', () => {
      it('should be visible', () => {
        const { getByText } = renderFooter({
          ...commonProps,
          currentContribution: {
            itemTypeMappingStatus: 'Valid',
            locationsMappingStatus: 'Invalid',
            status: 'Not started',
          },
        });

        expect(getByText('Tooltip')).toBeInTheDocument();
      });

      it('should be enabled', () => {
        const { getByRole } = renderFooter({
          ...commonProps,
          currentContribution: {
            itemTypeMappingStatus: 'Valid',
            locationsMappingStatus: 'Valid',
            status: 'Not started',
          },
        });

        expect(getByRole('button', { name: 'Initiate contribution' })).toBeEnabled();
      });
    });
  });

  describe('status "In Progress"', () => {
    describe('"Cancel contribution" button', () => {
      beforeEach(() => {
        renderFooter({
          ...commonProps,
          currentContribution: {
            itemTypeMappingStatus: 'Valid',
            locationsMappingStatus: 'Valid',
            status: 'In Progress',
          },
        });
      });

      it('should be visible', () => {
        expect(screen.getByRole('button', { name: 'Cancel contribution' })).toBeVisible();
      });

      it('should be enabled', () => {
        expect(screen.getByRole('button', { name: 'Cancel contribution' })).toBeEnabled();
      });
    });

    describe('"Pause" button', () => {
      beforeEach(() => {
        renderFooter({
          ...commonProps,
          currentContribution: {
            itemTypeMappingStatus: 'Valid',
            locationsMappingStatus: 'Valid',
            status: 'In Progress',
          },
        });
      });

      it('should be visible', () => {
        expect(screen.getByRole('button', { name: 'Pause' })).toBeVisible();
      });

      it('should be enabled', () => {
        expect(screen.getByRole('button', { name: 'Pause' })).toBeEnabled();
      });
    });
  });

  describe('status "Cancelled"', () => {
    describe('"Initiate contribution" button', () => {
      beforeEach(() => {
        renderFooter({
          ...commonProps,
          currentContribution: {
            itemTypeMappingStatus: 'Valid',
            locationsMappingStatus: 'Valid',
            status: 'Cancelled',
          },
        });
      });

      it('should be visible', () => {
        expect(screen.getByText('Initiate contribution')).toBeVisible();
      });

      it('should be enabled', () => {
        expect(screen.getByRole('button', { name: 'Initiate contribution' })).toBeEnabled();
      });
    });
  });
});
