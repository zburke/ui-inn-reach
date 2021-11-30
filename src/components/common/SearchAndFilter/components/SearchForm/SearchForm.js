import React, {
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import {
  Button,
  SearchField,
} from '@folio/stripes/components';

import css from './SearchForm.css';

const SearchForm = ({
  applySearch,
  changeSearch,
  searchQuery,
  isLoading,
  autoFocus,
  isInsideListSearch,
}) => {
  const insideFormClass = classNames({ [css.insideForm]: isInsideListSearch });
  const insideBtnClass = classNames({ [css.insideBtn]: isInsideListSearch });
  const insideSearchFieldClass = classNames({
    [css.insideSearch]: isInsideListSearch,
    [css.searchField]: !isInsideListSearch,
  });

  const reset = useCallback(
    () => changeSearch({ target: { value: '' } }),
    [changeSearch],
  );

  const submitSearch = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      applySearch();
    },
    [applySearch],
  );

  return (
    <form
      data-testid="search-form"
      className={insideFormClass}
      onSubmit={submitSearch}
    >
      <FormattedMessage id="ui-inn-reach.search">
        {ariaLabel => (
          <SearchField
            marginBottom0
            aria-label={ariaLabel}
            autoFocus={autoFocus}
            className={insideSearchFieldClass}
            id="input-record-search"
            loading={isLoading}
            value={searchQuery}
            onChange={changeSearch}
            onClear={reset}
          />
        )}
      </FormattedMessage>

      <Button
        data-test-search-form-submit
        fullWidth
        buttonClass={insideBtnClass}
        buttonStyle="primary"
        disabled={!searchQuery || isLoading}
        type="submit"
      >
        <FormattedMessage id="ui-inn-reach.search" />
      </Button>
    </form>
  );
};

SearchForm.propTypes = {
  applySearch: PropTypes.func.isRequired,
  changeSearch: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
  isInsideListSearch: PropTypes.bool,
  isLoading: PropTypes.bool,
  searchQuery: PropTypes.string,
};

SearchForm.defaultProps = {
  searchQuery: '',
  isLoading: false,
  autoFocus: true,
  isInsideListSearch: false,
};

export default SearchForm;
