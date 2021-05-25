import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
} from '@folio/stripes/components';

import css from './ActionItem.css';

const ActionItem = ({
  id,
  icon,
  buttonTextTranslationKey,
  onClickHandler,
  onToggle,
}) => (
  <Button
    id={id}
    buttonStyle="dropdownItem"
    onClick={() => {
      onToggle();
      onClickHandler();
    }}
  >
    <Icon
      icon={icon}
      size="medium"
      iconClassName={css.actionIcon}
    />
    <FormattedMessage id={buttonTextTranslationKey} />
  </Button>
);

ActionItem.propTypes = {
  buttonTextTranslationKey: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onClickHandler: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired
};

export default ActionItem;
