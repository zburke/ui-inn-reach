import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  PaneFooter,
} from '@folio/stripes-components';
import {
  FormattedMessage,
} from 'react-intl';

const Footer = ({
  pristine,
  invalid,
  onCancel,
  onHandleSubmit,
}) => {
  const cancelButton = (
    <Button
      data-testid="cancel-button"
      buttonStyle="default mega"
      onClick={onCancel}
    >
      <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.button.cancel" />
    </Button>
  );

  const saveButton = (
    <Button
      data-testid="save-button"
      buttonStyle="primary mega"
      type="submit"
      disabled={invalid || pristine}
      onClick={onHandleSubmit}
    >
      <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.button.save&close" />
    </Button>
  );

  return (
    <PaneFooter
      renderStart={cancelButton}
      renderEnd={saveButton}
    />
  );
};

Footer.propTypes = {
  invalid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onHandleSubmit: PropTypes.func.isRequired,
};

export default Footer;
