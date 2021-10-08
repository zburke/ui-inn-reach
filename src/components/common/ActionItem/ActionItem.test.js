import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import ActionItem from './ActionItem';

import { translationsProperties } from '../../../../test/jest/helpers';

const idEdit = 'editCentralServerConfigurationAction';
const buttonTextTranslationKeyEdit = 'ui-inn-reach.settings.central-server-configuration.action.edit';

const idDelete = 'deleteCentralServerConfigurationAction';
const buttonTextTranslationKeyDelete = 'ui-inn-reach.settings.central-server-configuration.action.delete';

const RenderActionItem = ({
  id,
  buttonTextTranslationKey,
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

  const renderedActionItem = (
    id = idEdit,
    buttonTextTranslationKey = buttonTextTranslationKeyEdit,
    onClick = handleClickEdit,
    onToggle = handleToggle,
  ) => renderWithIntl(
    <RenderActionItem
      id={id}
      buttonTextTranslationKey={buttonTextTranslationKey}
      onClickHandler={onClick}
      onToggle={onToggle}
    />,
    translationsProperties,
  );

  it('should be rendered', () => {
    const component = renderedActionItem();

    expect(component).toBeDefined();
  });

  it('should display button', () => {
    renderedActionItem();

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should display Edit button', () => {
    renderedActionItem();

    expect(screen.getByRole('button', { name: /Edit/ })).toBeInTheDocument();
  });

  it('should display Delete button', () => {
    renderedActionItem(idDelete, buttonTextTranslationKeyDelete, handleClickDelete);

    expect(screen.getByRole('button', { name: /Delete/ })).toBeInTheDocument();
  });

  it('should invoke onEdit callback', () => {
    renderedActionItem();

    userEvent.click(screen.getByRole('button', { name: /Edit/ }));
    expect(handleClickEdit).toBeCalled();
  });

  it('should invoke onDelete callback', () => {
    renderedActionItem(idDelete, buttonTextTranslationKeyDelete, handleClickDelete);

    userEvent.click(screen.getByRole('button', { name: /Delete/ }));
    expect(handleClickDelete).toBeCalled();
  });

  it('should invoke onToggle callback', () => {
    renderedActionItem();

    userEvent.click(screen.getByRole('button', { name: /Edit/ }));
    expect(handleToggle).toBeCalled();
  });
});
