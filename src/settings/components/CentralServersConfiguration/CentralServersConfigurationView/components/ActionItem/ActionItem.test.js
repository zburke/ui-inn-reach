import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import ActionItem from './ActionItem';

import { translationsProperties } from '../../../../../../../test/jest/helpers';

const idEdit = 'editCentralServerConfigurationAction';
const buttonTextTranslationKeyEdit = 'ui-inn-reach.settings.central-server-configuration.action.edit';

const idDelete = 'deleteCentralServerConfigurationAction';
const buttonTextTranslationKeyDelete = 'ui-inn-reach.settings.central-server-configuration.action.delete';

const RenderActionItem = ({
  id = idEdit,
  buttonTextTranslationKey = buttonTextTranslationKeyEdit,
  onClickHandler,
  onToggle,
}) => {
  return (
    <ActionItem
      id={id}
      icon='test icon'
      buttonTextTranslationKey={buttonTextTranslationKey}
      onClickHandler={onClickHandler}
      onToggle={onToggle}
    />
  );
};

describe('ActionItem component', () => {
  const handleClickEdit = jest.fn();
  const handleClickDelete = jest.fn();
  const handleToggle = jest.fn();

  beforeEach(() => (
    renderWithIntl(
      <RenderActionItem
        onClickHandler={handleClickEdit}
        onToggle={handleToggle}
      />,
      translationsProperties,
    )
  ));

  it('should be rendered', () => {
    const component = (handleClick) => renderWithIntl(
      <RenderActionItem
        onClickHandler={handleClick}
        onToggle={handleToggle}
      />,
      translationsProperties,
    );

    expect(component(handleClickEdit)).toBeDefined();
  });

  it('should display button', () => {
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should display Edit button', () => {
    expect(screen.getByRole('button', { name: /Edit/ })).toBeInTheDocument();
  });

  it('should display Delete button', () => {
    renderWithIntl(
      <RenderActionItem
        id={idDelete}
        buttonTextTranslationKey={buttonTextTranslationKeyDelete}
        onClickHandler={handleClickDelete}
        onToggle={handleToggle}
      />,
      translationsProperties,
    );

    expect(screen.getByRole('button', { name: /Delete/ })).toBeInTheDocument();
  });

  it('should invoke onEdit callback', () => {
    userEvent.click(screen.getByRole('button', { name: /Edit/ }));
    expect(handleClickEdit).toBeCalled();
  });

  it('should invoke onDelete callback', () => {
    renderWithIntl(
      <RenderActionItem
        id={idDelete}
        buttonTextTranslationKey={buttonTextTranslationKeyDelete}
        onClickHandler={handleClickDelete}
        onToggle={handleToggle}
      />,
      translationsProperties,
    );

    userEvent.click(screen.getByRole('button', { name: /Delete/ }));
    expect(handleClickDelete).toBeCalled();
  });

  it('should invoke onToggle callback', () => {
    userEvent.click(screen.getByRole('button', { name: /Edit/ }));
    expect(handleToggle).toBeCalled();
  });
});
