import React, {
  useContext,
  useEffect,
  useMemo,
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
  validateServerCode,
} from './utils/formValidation';
import {
  required,
} from '../../../../utils';

import {
  CENTRAL_SERVER_CONFIGURATION_FIELDS,
  FILL_PANE_WIDTH,
} from '../../../../constants';

import styles from './CentralServersConfigurationForm.css';

const {
  CENTRAL_SERVER_ADDRESS,
  CENTRAL_SERVER_KEY,
  CENTRAL_SERVER_SECRET,
  LOCAL_SERVER_KEY,
  LOCAL_SERVER_SECRET,
  NAME,
  DESCRIPTION,
  CENTRAL_SERVER_CODE,
  LOCAL_SERVER_CODE,
  LOAN_TYPE_ID,
} = CENTRAL_SERVER_CONFIGURATION_FIELDS;

const validate = (values) => ({
  ...validateLocalAgency(values.localAgencies),
});

const CentralConfigurationForm = ({
  initialValues,
  isEditMode,
  showPrevLocalServerValue,
  onShowPreviousLocalServerValue,
  onCancel,
  handleSubmit,
  invalid,
  dirtyFieldsSinceLastSubmit,
  form,
  pristine,
  onChangePristineState,
}) => {
  const {
    folioLibraries,
    loanTypes,
  } = useContext(CentralServersConfigurationContext);
  const [sections, setSections] = useState({
    section1: true,
    section2: true,
  });
  const [isSecretFieldsHaveMask, setIsSecretFieldsHaveMask] = useState(isEditMode);

  const secretFieldType = isSecretFieldsHaveMask ? 'password' : 'text';
  const loanTypeOptions = useMemo(() => loanTypes.map(({ id, name }) => ({
    label: name,
    value: id,
    id,
  })), [loanTypes]);

  const changeLocalServerKeypair = (localServerKey, localServerSecret) => {
    form.change(LOCAL_SERVER_KEY, localServerKey);
    form.change(LOCAL_SERVER_SECRET, localServerSecret);
  };

  const generateKeyAndSecret = () => {
    const localServerKey = uuidv4();
    const localServerSecret = uuidv4();

    changeLocalServerKeypair(localServerKey, localServerSecret);
  };

  const onToggleSection = ({ id }) => {
    setSections(prevState => ({ ...prevState, [id]: !prevState[id] }));
  };

  const toggleSecretMask = () => {
    setIsSecretFieldsHaveMask(prevState => !prevState);
  };

  useEffect(() => {
    onChangePristineState(pristine);
  }, [pristine]);

  useEffect(() => {
    if (showPrevLocalServerValue) {
      changeLocalServerKeypair(
        initialValues[LOCAL_SERVER_KEY],
        initialValues[LOCAL_SERVER_SECRET]
      );
      onShowPreviousLocalServerValue(false);
    }
  }, [showPrevLocalServerValue]);

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

  return (
    <form
      data-testid="central-server-configuration-form"
      className={styles.instanceForm}
    >
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
                  name={NAME}
                  type="text"
                  component={TextField}
                  label={<FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.field.name" />}
                  validate={required}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Field
                  name={DESCRIPTION}
                  label={<FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.field.description" />}
                  component={TextArea}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={3}>
                <Field
                  required
                  name={CENTRAL_SERVER_CODE}
                  type="text"
                  component={TextField}
                  label={<FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.field.centralServerCode" />}
                  validate={required}
                />
              </Col>
              <Col sm={3}>
                <Field
                  required
                  name={LOCAL_SERVER_CODE}
                  type="text"
                  component={TextField}
                  label={<FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.field.localServerCode" />}
                  validate={validateServerCode}
                />
              </Col>
            </Row>
            <LocalAgencyFields librariesTypes={folioLibraries} />
            <Row>
              <Col sm={3}>
                <Field
                  required
                  data-testid="borrowedItemLoanType"
                  label={<FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.field.borrowedItemLoanType" />}
                  name={LOAN_TYPE_ID}
                  type="text"
                  placeholder=" "
                  component={Select}
                  dataOptions={loanTypeOptions}
                  validate={required}
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
                  onClick={generateKeyAndSecret}
                >
                  <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.button.generateKeypair" />
                </Button>
                {isEditMode &&
                  <Button
                    data-testid="toggle-secret-mask"
                    onClick={toggleSecretMask}
                  >
                    <FormattedMessage id={`ui-inn-reach.settings.central-server-configuration.create-edit.button.${isSecretFieldsHaveMask ? 'show' : 'hide'}-secrets`} />
                  </Button>
                }
              </Col>
            </Row>
          </Accordion>
        </div>
      </Pane>
    </form>
  );
};

CentralConfigurationForm.propTypes = {
  dirtyFieldsSinceLastSubmit: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  invalid: PropTypes.bool.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  showPrevLocalServerValue: PropTypes.bool,
  values: PropTypes.object,
  onChangePristineState: PropTypes.func,
  onShowPreviousLocalServerValue: PropTypes.func,
};

export default stripesFinalForm({
  validate,
  subscription: {
    invalid: true,
    dirtyFieldsSinceLastSubmit: true,
    values: true,
  },
  initialValuesEqual: (a, b) => isEqual(a, b),
})(CentralConfigurationForm);
