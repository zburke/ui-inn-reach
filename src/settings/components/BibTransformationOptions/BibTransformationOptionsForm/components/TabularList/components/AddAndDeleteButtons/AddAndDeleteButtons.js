import React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import {
  Col,
  IconButton,
  Row,
} from '@folio/stripes-components';
import {
  ICONS,
} from '../../../../../../../../constants';
import css from '../../TabularList.css';

const {
  ADD,
  DELETE,
} = ICONS;

const AddAndDeleteButtons = ({
  isDeleteButtonDisabled,
  index,
  onAdd,
  onDelete,
}) => {
  return (
    <Col className={classNames(css.tabularCol, css.customColSmWidth)}>
      <Row>
        <Col sm={6}>
          <FormattedMessage id="ui-inn-reach.settings.bib-transformation.button.add">
            {([ariaLabel]) => (
              <IconButton
                icon={ADD}
                aria-label={ariaLabel}
                onClick={onAdd}
              />
            )}
          </FormattedMessage>
        </Col>
        <Col sm={6}>
          <FormattedMessage
            id="ui-inn-reach.settings.bib-transformation.button.remove"
            values={{ num: index + 1 }}
          >
            {([ariaLabel]) => (
              <IconButton
                icon={DELETE}
                className={isDeleteButtonDisabled ? css.cursorNone : null}
                aria-label={ariaLabel}
                disabled={isDeleteButtonDisabled}
                onClick={onDelete}
              />
            )}
          </FormattedMessage>
        </Col>
      </Row>
    </Col>
  );
};

export default AddAndDeleteButtons;
