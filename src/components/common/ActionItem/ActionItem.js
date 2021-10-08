import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
} from '@folio/stripes-components';

import css from './ActionItem.css';

const ActionItem = ({
  id,
  buttonStyle,
  icon,
  size,
  buttonTextTranslationKey,
  disabled,
  onClickHandler,
  onToggle,
}) => (
  <Button
    id={id}
    buttonStyle={buttonStyle}
    disabled={disabled}
    onClick={() => {
      onToggle();
      onClickHandler();
    }}
  >
    <Icon
      icon={icon}
      size={size}
      iconClassName={css.actionIcon}
    />
    <FormattedMessage id={buttonTextTranslationKey} />
  </Button>
);

ActionItem.propTypes = {
  buttonTextTranslationKey: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  onToggle: PropTypes.func.isRequired,
  buttonStyle: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  size: PropTypes.string,
  onClickHandler: PropTypes.func,
};

ActionItem.defaultProps = {
  size: 'medium',
  buttonStyle: 'dropdownItem',
};

export default ActionItem;
