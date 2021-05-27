import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  Field,
} from 'react-final-form';
import {
  isEqual,
} from 'lodash';
import { FormattedMessage } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';

import {
  Accordion,
  Paneset,
  Pane,
  Row,
  Col,
  Button,
  TextField,
  TextArea,
  Select,
  PaneFooter,
  ExpandAllButton,
  Label,
} from '@folio/stripes-components';
import stripesFinalForm from '@folio/stripes/final-form';

import { CentralServersConfigurationContext } from '../../../../contexts';
import LocalAgencyFields from './components/LocalAgencyFields';

import {
  validateLocalAgency,
  validateLocalServerCode,
  validateRequired,
} from './utils/formValidation';

import {
  CENTRAL_SERVER_CONFIGURATION_FIELDS,
  FILL_PANE_WIDTH,
} from '../../../../constants';

import styles from './CentralServersConfigurationForm.css';

const validate = (values) => ({
  ...validateLocalAgency(values),
});

const CentralConfigurationForm = ({
  saveLocalServerKeypair,
  initialValues,
  isLocalServerToPrevValue,
  changeIsLocalServerToPrevValue,
  onCancel,
  handleSubmit,
  invalid,
  isCentralServerDataInvalid,
  dirtyFieldsSinceLastSubmit,
  form,
  pristine,
}) => {
  const data = useContext(CentralServersConfigurationContext);
  const [sections, setSections] = useState({
    section1: true,
    section2: true,
  });

  const changeLocalServerKeypair = (localServerKey, localServerSecret) => {
    form.change(CENTRAL_SERVER_CONFIGURATION_FIELDS.LOCAL_SERVER_KEY, localServerKey);
    form.change(CENTRAL_SERVER_CONFIGURATION_FIELDS.LOCAL_SERVER_SECRET, localServerSecret);
  };

  const generateKeyAndSecret = () => {
    const localServerKey = uuidv4();
    const localServerSecret = uuidv4();
    const exportData = { localServerKey, localServerSecret };

    changeLocalServerKeypair(localServerKey, localServerSecret);
    saveLocalServerKeypair(exportData);
  };

  const onToggleSection = ({ id }) => {
    setSections(prevState => ({ ...prevState, [id]: !prevState[id] }));
  };

  useEffect(() => {
    if (isLocalServerToPrevValue) {
      changeLocalServerKeypair(
        initialValues[CENTRAL_SERVER_CONFIGURATION_FIELDS.LOCAL_SERVER_KEY],
        initialValues[CENTRAL_SERVER_CONFIGURATION_FIELDS.LOCAL_SERVER_SECRET]
      );
      changeIsLocalServerToPrevValue(false);
    }
  }, [isLocalServerToPrevValue]);

  const getPaneTitle = () => {
    const titleTranslationKey = initialValues?.id
      ? 'ui-inn-reach.settings.central-server-configuration.edit.title.edit'
      : 'ui-inn-reach.settings.central-server-configuration.create.title.newCentralServerConfig';

    return (
      <span data-test-header-title>
        <FormattedMessage id={titleTranslationKey} />
      </span>
    );
  };

  const getFooter = () => {
    const isCentralServerInvalid = (
      isCentralServerDataInvalid &&
      !dirtyFieldsSinceLastSubmit[CENTRAL_SERVER_CONFIGURATION_FIELDS.CENTRAL_SERVER_ADDRESS] &&
      !dirtyFieldsSinceLastSubmit[CENTRAL_SERVER_CONFIGURATION_FIELDS.CENTRAL_SERVER_KEY] &&
      !dirtyFieldsSinceLastSubmit[CENTRAL_SERVER_CONFIGURATION_FIELDS.CENTRAL_SERVER_SECRET]
    );

    const cancelButton = (
      <Button
        data-testid="cancel-button"
        buttonStyle="default mega"
        id="cancel-instance-edition"
        onClick={onCancel}
      >
        <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.button.cancel" />
      </Button>
    );

    const saveButton = (
      <Button
        data-testid="save-button"
        id="clickable-save-instance"
        buttonStyle="primary mega"
        type="submit"
        disabled={invalid || isCentralServerInvalid || pristine}
        onClick={handleSubmit}
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

  const handleExpandAll = (sectionsState) => {
    setSections(sectionsState);
  };

  const loanTypeOptions = data.loanTypes
    ? data.loanTypes.map(loanType => ({
      label: loanType.name,
      value: loanType.id,
      id: loanType.id,
    }))
    : [];

  return (
    <form
      data-testid="central-server-configuration-form"
      className={styles.instanceForm}
    >
      <Paneset>
        <Pane
          dismissible
          centerContent
          defaultWidth={FILL_PANE_WIDTH}
          footer={getFooter()}
          paneTitle={getPaneTitle()}
          onClose={onCancel}
        >
          <div>
            <Row end="xs">
              <Col xs>
                <ExpandAllButton
                  accordionStatus={sections}
                  onToggle={handleExpandAll}
                />
              </Col>
            </Row>
            <Accordion
              label={
                <h3>
                  <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.accordion.generalInformation.title" />
                </h3>
              }
              id="section1"
              open={sections.section1}
              onToggle={onToggleSection}
            >
              <Row>
                <Col sm={4}>
                  <Field
                    required
                    name={CENTRAL_SERVER_CONFIGURATION_FIELDS.NAME}
                    type="text"
                    component={TextField}
                    label={<FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.field.name" />}
                    validate={validateRequired}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <Field
                    name={CENTRAL_SERVER_CONFIGURATION_FIELDS.DESCRIPTION}
                    label={<FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.field.description" />}
                    component={TextArea}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={3}>
                  <Field
                    required
                    name={CENTRAL_SERVER_CONFIGURATION_FIELDS.LOCAL_SERVER_CODE}
                    type="text"
                    component={TextField}
                    label={<FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.field.localServerCode" />}
                    validate={validateLocalServerCode}
                  />
                </Col>
              </Row>
              <LocalAgencyFields librariesTypes={data.folioLibraries} />
              <Row>
                <Col sm={3}>
                  <Field
                    required
                    data-testid="borrowedItemLoanType"
                    label={<FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.field.borrowedItemLoanType" />}
                    name={CENTRAL_SERVER_CONFIGURATION_FIELDS.LOAN_TYPE_ID}
                    type="text"
                    placeholder=" "
                    component={Select}
                    dataOptions={loanTypeOptions}
                    validate={validateRequired}
                  />
                </Col>
              </Row>
            </Accordion>
            <Accordion
              label={
                <h3>
                  <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.accordion.serverConnection.title" />
                </h3>
              }
              open={sections.section2}
              id="section2"
              onToggle={onToggleSection}
            >
              <Row>
                <Col xs={4}>
                  <Field
                    required
                    name={CENTRAL_SERVER_CONFIGURATION_FIELDS.CENTRAL_SERVER_ADDRESS}
                    type="text"
                    component={TextField}
                    label={<FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.field.centralServerAddress" />}
                    validate={validateRequired}
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    required
                    name={CENTRAL_SERVER_CONFIGURATION_FIELDS.CENTRAL_SERVER_KEY}
                    type="text"
                    component={TextField}
                    label={<FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.field.centralServerKey" />}
                    validate={validateRequired}
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    required
                    name={CENTRAL_SERVER_CONFIGURATION_FIELDS.CENTRAL_SERVER_SECRET}
                    type="text"
                    component={TextField}
                    label={<FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.field.centralServerSecret" />}
                    validate={validateRequired}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={4}>
                  <Field name={CENTRAL_SERVER_CONFIGURATION_FIELDS.LOCAL_SERVER_KEY}>
                    {({ input }) => (
                      <>
                        <Label htmlFor={CENTRAL_SERVER_CONFIGURATION_FIELDS.LOCAL_SERVER_KEY}>
                          <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.field.localServerKey" />
                        </Label>
                        <div className={classNames(styles.formControl, styles.isDisabled, styles.inputGroup)}>
                          <input
                            {...input}
                            disabled
                            id={CENTRAL_SERVER_CONFIGURATION_FIELDS.LOCAL_SERVER_KEY}
                            data-testid={CENTRAL_SERVER_CONFIGURATION_FIELDS.LOCAL_SERVER_KEY}
                            type="text"
                          />
                        </div>
                      </>
                    )}
                  </Field>
                </Col>
                <Col xs={4}>
                  <Field name={CENTRAL_SERVER_CONFIGURATION_FIELDS.LOCAL_SERVER_SECRET}>
                    {({ input }) => (
                      <>
                        <Label htmlFor={CENTRAL_SERVER_CONFIGURATION_FIELDS.LOCAL_SERVER_SECRET}>
                          <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.field.localServerSecret" />
                        </Label>
                        <div className={classNames(styles.formControl, styles.isDisabled, styles.inputGroup)}>
                          <input
                            {...input}
                            disabled
                            id={CENTRAL_SERVER_CONFIGURATION_FIELDS.LOCAL_SERVER_SECRET}
                            data-testid={CENTRAL_SERVER_CONFIGURATION_FIELDS.LOCAL_SERVER_SECRET}
                            type="text"
                          />
                        </div>
                      </>
                    )}
                  </Field>
                </Col>
                <Col xs={4}>
                  <Button
                    data-testid="generate-keypair"
                    buttonStyle="default"
                    buttonClass={styles.generateKeypair}
                    id="cancel-instance-edition"
                    onClick={generateKeyAndSecret}
                  >
                    <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.button.generateKeypair" />
                  </Button>
                </Col>
              </Row>
            </Accordion>
          </div>
        </Pane>
      </Paneset>
    </form>
  );
};

CentralConfigurationForm.propTypes = {
  dirtyFieldsSinceLastSubmit: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  saveLocalServerKeypair: PropTypes.func.isRequired,
  changeIsLocalServerToPrevValue: PropTypes.func,
  form: PropTypes.object,
  initialValues: PropTypes.object,
  isCentralServerDataInvalid: PropTypes.bool,
  isLocalServerToPrevValue: PropTypes.bool,
  pristine: PropTypes.bool,
  onCancel: PropTypes.func,
  onClose: PropTypes.func,
};

export default stripesFinalForm({
  validate,
  subscription: {
    invalid: true,
    error: true,
    dirtyFieldsSinceLastSubmit: true,
    submitSucceeded: true,
  },
  initialValuesEqual: (a, b) => isEqual(a, b),
  navigationCheck: true,
})(CentralConfigurationForm);
