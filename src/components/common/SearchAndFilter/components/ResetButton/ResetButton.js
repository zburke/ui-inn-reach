import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
} from '@folio/stripes/components';

import css from './ResetButton.css';
import {
  ICONS,
} from '../../../../../constants';

const defaultLabel = <FormattedMessage id="ui-inn-reach.resetAllFilters" />;

const ResetButton = ({ id, disabled, label, reset }) => {
  return (
    <div>
      <Button
        buttonClass={css.resetButton}
        buttonStyle="none"
        disabled={disabled}
        id={id}
        onClick={reset}
      >
        <Icon
          icon={ICONS.TIMES_CIRCLE_SOLID}
          size="small"
        >
          {label}
        </Icon>
      </Button>
    </div>
  );
};

ResetButton.propTypes = {
  reset: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.node,
};

ResetButton.defaultProps = {
  label: defaultLabel,
};

export default ResetButton;
