import React from 'react';
import PropTypes from 'prop-types';
import {
  ActionItem,
} from '../../../../../../common';
import {
  ICONS,
} from '../../../../../../../constants';

const PatronActions = ({
  onToggle,
}) => {
  return (
    <>
      <ActionItem
        icon={ICONS.CHECK_OUT}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.action.check-out"
        onToggle={onToggle}
        onClickHandler={() => null}
      />
      <ActionItem
        icon={ICONS.RECEIVE}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.action.receive-item"
        onToggle={onToggle}
        onClickHandler={() => null}
      />
      <ActionItem
        icon={ICONS.RECEIVE}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.action.receive-unshipped-item"
        onToggle={onToggle}
        onClickHandler={() => null}
      />
      <ActionItem
        icon={ICONS.CHECK_IN}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.action.return-item"
        onToggle={onToggle}
        onClickHandler={() => null}
      />
      <ActionItem
        icon={ICONS.TIMES_CIRCLE}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.action.cancel-hold"
        onToggle={onToggle}
        onClickHandler={() => null}
      />
    </>
  );
};

PatronActions.propTypes = {
  onToggle: PropTypes.func.isRequired,
};

export default PatronActions;
