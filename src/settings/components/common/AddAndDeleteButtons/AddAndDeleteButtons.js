import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Col,
  IconButton,
  Row,
} from '@folio/stripes-components';
import {
  ICONS,
} from '../../../../constants';
import css from './AddAndDeleteButtons.css';

const {
  ADD,
  DELETE,
} = ICONS;

const AddAndDeleteButtons = ({
  fields,
  index,
  newRowTemplate,
  addRowAfterCurrent,
  srsRef,
}) => {
  const isDeleteButtonDisabled = fields.length === 1;

  const handleAddRow = () => {
    if (addRowAfterCurrent) {
      addRowAfterCurrent(index, newRowTemplate);
    } else {
      fields.push(newRowTemplate);
    }

    srsRef.current.sendMessage(
      <FormattedMessage
        id="ui-inn-reach.action.after-click-add"
        values={{ fieldsLength: fields.length + 1 }}
      />
    );
  };

  const handleDeleteRow = () => {
    fields.remove(index);

    srsRef.current.sendMessage(
      <FormattedMessage
        id="ui-inn-reach.action.after-click-remove"
        values={{
          fieldsLength: fields.length - 1,
          index: index + 1,
        }}
      />
    );
  };

  return (
    <Col
      sm={1}
      className={css.tabularCol}
    >
      <Row>
        <Col sm={6}>
          <FormattedMessage id="ui-inn-reach.action.focus.add">
            {([ariaLabel]) => (
              <IconButton
                data-testid="addButton"
                icon={ADD}
                aria-label={ariaLabel}
                onClick={handleAddRow}
              />
            )}
          </FormattedMessage>
        </Col>
        <Col sm={6}>
          <FormattedMessage
            id="ui-inn-reach.action.focus.remove"
            values={{ num: index + 1 }}
          >
            {([ariaLabel]) => (
              <IconButton
                data-testid="deleteButton"
                icon={DELETE}
                className={isDeleteButtonDisabled ? css.cursorNone : null}
                aria-label={ariaLabel}
                disabled={isDeleteButtonDisabled}
                onClick={handleDeleteRow}
              />
            )}
          </FormattedMessage>
        </Col>
      </Row>
    </Col>
  );
};

AddAndDeleteButtons.propTypes = {
  fields: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  newRowTemplate: PropTypes.object.isRequired,
  srsRef: PropTypes.object.isRequired,
  addRowAfterCurrent: PropTypes.func,
};

export default AddAndDeleteButtons;
