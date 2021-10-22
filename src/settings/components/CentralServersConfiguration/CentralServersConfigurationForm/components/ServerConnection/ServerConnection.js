import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';
import {
  Accordion,
  Button,
  Col,
  Label,
  Row,
  TextField,
} from '@folio/stripes-components';
import {
  Field,
} from 'react-final-form';
import classNames from 'classnames';
import {
  required,
} from '../../../../../../utils';
import {
  CENTRAL_SERVER_CONFIGURATION_FIELDS,
} from '../../../../../../constants';
import styles from '../../CentralServersConfigurationForm.css';

const {
  CENTRAL_SERVER_ADDRESS,
  CENTRAL_SERVER_KEY,
  CENTRAL_SERVER_SECRET,
  LOCAL_SERVER_KEY,
  LOCAL_SERVER_SECRET,
} = CENTRAL_SERVER_CONFIGURATION_FIELDS;

const ServerConnection = ({
  section,
  secretFieldType,
  isEditMode,
  isSecretFieldsHaveMask,
  onToggleSecretMask,
  onToggleSection,
  onGenerateKeyAndSecret,
}) => {
  return (
    <Accordion
      label={
        <h3>
          <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.accordion.serverConnection.title" />
        </h3>
      }
      open={section}
      id="section2"
      onToggle={onToggleSection}
    >
      <Row>
        <Col xs={4}>
          <Field
            required
            name={CENTRAL_SERVER_ADDRESS}
            type="text"
            component={TextField}
            label={<FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.field.centralServerAddress" />}
            validate={required}
          />
        </Col>
        <Col xs={4}>
          <Field
            required
            name={CENTRAL_SERVER_KEY}
            type="text"
            component={TextField}
            label={<FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.field.centralServerKey" />}
            validate={required}
          />
        </Col>
        <Col xs={4}>
          <Field
            required
            name={CENTRAL_SERVER_SECRET}
            type={secretFieldType}
            component={TextField}
            label={<FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.field.centralServerSecret" />}
            validate={required}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <Field name={LOCAL_SERVER_KEY}>
            {({ input }) => (
              <>
                <Label htmlFor={LOCAL_SERVER_KEY}>
                  <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.field.localServerKey" />
                </Label>
                <div className={classNames(styles.formControl, styles.isDisabled, styles.inputGroup)}>
                  <input
                    {...input}
                    disabled
                    id={LOCAL_SERVER_KEY}
                    data-testid={LOCAL_SERVER_KEY}
                    type="text"
                  />
                </div>
              </>
            )}
          </Field>
        </Col>
        <Col xs={4}>
          <Field name={LOCAL_SERVER_SECRET}>
            {({ input }) => (
              <>
                <Label htmlFor={LOCAL_SERVER_SECRET}>
                  <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.field.localServerSecret" />
                </Label>
                <div className={classNames(styles.formControl, styles.isDisabled, styles.inputGroup)}>
                  <input
                    {...input}
                    disabled
                    id={LOCAL_SERVER_SECRET}
                    data-testid={LOCAL_SERVER_SECRET}
                    type={secretFieldType}
                  />
                </div>
              </>
            )}
          </Field>
        </Col>
        <Col xs={4}>
          <Button
            data-testid="generate-keypair"
            buttonClass={styles.generateKeypair}
            onClick={onGenerateKeyAndSecret}
          >
            <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.button.generateKeypair" />
          </Button>
          {isEditMode &&
            <Button
              data-testid="toggle-secret-mask"
              onClick={onToggleSecretMask}
            >
              <FormattedMessage id={`ui-inn-reach.settings.central-server-configuration.create-edit.button.${isSecretFieldsHaveMask ? 'show' : 'hide'}-secrets`} />
            </Button>
          }
        </Col>
      </Row>
    </Accordion>
  );
};

ServerConnection.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  isSecretFieldsHaveMask: PropTypes.bool.isRequired,
  secretFieldType: PropTypes.string.isRequired,
  section: PropTypes.bool.isRequired,
  onGenerateKeyAndSecret: PropTypes.func.isRequired,
  onToggleSecretMask: PropTypes.func.isRequired,
  onToggleSection: PropTypes.func.isRequired,
};

export default ServerConnection;
