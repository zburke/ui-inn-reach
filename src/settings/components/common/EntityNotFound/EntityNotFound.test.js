import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import EntityNotFound from './EntityNotFound';

import { translationsProperties } from '../../../../../test/jest/helpers';

import { FILL_PANE_WIDTH } from '../../../../constants';

const RenderEntityNotFound = ({
  pageTitleTranslationKey = 'ui-inn-reach.settings.central-server-configuration.view.notFound.title',
  errorTextTranslationKey = 'ui-inn-reach.settings.central-server-configuration.view.notFound.text',
  paneWidth = FILL_PANE_WIDTH,
  onBack,
}) => {
  return (
    <EntityNotFound
      pageTitleTranslationKey={pageTitleTranslationKey}
      errorTextTranslationKey={errorTextTranslationKey}
      paneWidth={paneWidth}
      onBack={onBack}
    />
  );
};

describe('EntityNotFound component', () => {
  const handleClickBack = jest.fn();

  let renderedEntityNotFound;

  beforeEach(() => {
    renderedEntityNotFound = renderWithIntl(
      <RenderEntityNotFound
        onBack={handleClickBack}
      />,
      translationsProperties,
    );

    return renderedEntityNotFound;
  });

  it('should be rendered', () => {
    expect(renderedEntityNotFound).toBeDefined();
  });

  it('should display Close button', () => {
    expect(screen.getByRole('button', { name: /Close/ })).toBeInTheDocument();
  });

  it('should invoke onBack callback', () => {
    userEvent.click(screen.getByRole('button', { name: /Close/ }));
    expect(handleClickBack).toBeCalled();
  });

  it('should display pane title', () => {
    const isTitle = document.querySelector('.paneTitle').getAttribute('data-test-pane-header-title');

    expect(isTitle).toBe('true');
  });

  it('should display error message', () => {
    const isErrorMsg = document.querySelector('[data-test-message-banner]').classList.contains('type-error');

    expect(isErrorMsg).toBe(true);
  });
});
