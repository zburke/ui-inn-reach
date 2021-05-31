import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import FirsrMenuCloseButton from './FirsrMenuCloseButton';

import { translationsProperties } from '../../../../../test/jest/helpers';

const RenderFirsrMenuCloseButton = ({
  onClickHandler,
}) => {
  return (
    <FirsrMenuCloseButton
      onClickHandler={onClickHandler}
    />
  );
};

describe('FirsrMenuCloseButton component', () => {
  const handleClick = jest.fn();

  let renderedCloseButton;

  beforeEach(() => {
    renderedCloseButton = renderWithIntl(
      <RenderFirsrMenuCloseButton
        onClickHandler={handleClick}
      />,
      translationsProperties,
    );

    return renderedCloseButton;
  });

  it('should be rendered', () => {
    expect(renderedCloseButton).toBeDefined();
  });

  it('should display button', () => {
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should display Cancel icon button', () => {
    expect(screen.getByRole('button', { name: /Cancel/ }).getAttribute('aria-label')).toEqual('Cancel');
  });

  it('should invoke onEdit callback', () => {
    userEvent.click(screen.getByRole('button', { name: /Cancel/ }));
    expect(handleClick).toBeCalled();
  });
});
