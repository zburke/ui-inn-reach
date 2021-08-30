import React from 'react';
import {
  Col,
  IconButton,
  Row,
} from '@folio/stripes-components';
import { FormattedMessage } from 'react-intl';
import {
  ICONS,
} from '../../../../../../../../constants';
import css from '../../TabularList.css';

const {
  ARROW_UP,
  ARROW_DOWN,
} = ICONS;

const SwapButtons = ({
  isUpButtonVisible,
  isDownButtonVisible,
  index,
  onSwapRows,
}) => {
  return (
    <Col
      sm={1}
      className={css.tabularCol}
    >
      <Row>
        <Col sm={6}>
          {isUpButtonVisible && (
            <FormattedMessage id="ui-inn-reach.settings.bib-transformation.button.up">
              {([ariaLabel]) => (
                <IconButton
                  icon={ARROW_UP}
                  aria-label={ariaLabel}
                  onClick={() => onSwapRows(index, index - 1)}
                />
              )}
            </FormattedMessage>

          )}
        </Col>
        <Col sm={6}>
          {isDownButtonVisible && (
            <FormattedMessage id="ui-inn-reach.settings.bib-transformation.button.down">
              {([ariaLabel]) => (
                <IconButton
                  icon={ARROW_DOWN}
                  aria-label={ariaLabel}
                  onClick={() => onSwapRows(index, index + 1)}
                />
              )}
            </FormattedMessage>
          )}
        </Col>
      </Row>
    </Col>
  );
};

export default SwapButtons;
