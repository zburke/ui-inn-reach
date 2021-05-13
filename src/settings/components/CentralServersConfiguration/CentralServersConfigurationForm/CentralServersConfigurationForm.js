import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Field } from 'react-final-form';
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
  onCancel,
  handleSubmit,
  hasValidationErrors,
  isCentralServerDataInvalid,
  dirtyFieldsSinceLastSubmit,
  data,
}) => {
  const [sections, setSections] = useState({
    section1: true,
    section2: true,
  });

  let onChangeLocalServerKey;
  let onChangeLocalServerSecret;

  const generateKeyAndSecret = () => {
    const localServerKey = uuidv4();
    const localServerSecret = uuidv4();
    const exportData = { localServerKey, localServerSecret };

    onChangeLocalServerKey({ target: { value: localServerKey } });
    onChangeLocalServerSecret({ target: { value: localServerSecret } });
    saveLocalServerKeypair(exportData);
  };

  const onToggleSection = ({ id }) => {
    setSections(prevState => ({ ...prevState, [id]: !prevState[id] }));
  };

  const getPaneTitle = () => {
    const titleTranslationKey = initialValues.id
      ? 'ui-inn-reach.editCentralServerConfig'
      : 'ui-inn-reach.newCentralServerConfig';

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
        <FormattedMessage id="ui-inn-reach.cancel" />
      </Button>
    );

    const saveButton = (
      <Button
        data-testid="save-button"
        id="clickable-save-instance"
        buttonStyle="primary mega"
        type="submit"
        disabled={hasValidationErrors || isCentralServerInvalid}
        onClick={handleSubmit}
      >
        <FormattedMessage id="ui-inn-reach.save&close" />
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
                  <FormattedMessage id="ui-inn-reach.generalInformation" />
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
                    label={<FormattedMessage id={`ui-inn-reach.${CENTRAL_SERVER_CONFIGURATION_FIELDS.NAME}`} />}
                    validate={validateRequired}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <Field
                    name={CENTRAL_SERVER_CONFIGURATION_FIELDS.DESCRIPTION}
                    label={<FormattedMessage id={`ui-inn-reach.${CENTRAL_SERVER_CONFIGURATION_FIELDS.DESCRIPTION}`} />}
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
                    label={<FormattedMessage id={`ui-inn-reach.${CENTRAL_SERVER_CONFIGURATION_FIELDS.LOCAL_SERVER_CODE}`} />}
                    validate={validateLocalServerCode}
                  />
                </Col>
              </Row>
              <LocalAgencyFields librariesTypes={data.folioLibraries} />
              <Row>
                <Col sm={3}>
                  <Field
                    required
                    label={<FormattedMessage id="ui-inn-reach.borrowedItemLoanType" />}
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
                  <FormattedMessage id="ui-inn-reach.serverConnection" />
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
                    label={<FormattedMessage id={`ui-inn-reach.${CENTRAL_SERVER_CONFIGURATION_FIELDS.CENTRAL_SERVER_ADDRESS}`} />}
                    validate={validateRequired}
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    required
                    name={CENTRAL_SERVER_CONFIGURATION_FIELDS.CENTRAL_SERVER_KEY}
                    type="text"
                    component={TextField}
                    label={<FormattedMessage id={`ui-inn-reach.${CENTRAL_SERVER_CONFIGURATION_FIELDS.CENTRAL_SERVER_KEY}`} />}
                    validate={validateRequired}
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    required
                    name={CENTRAL_SERVER_CONFIGURATION_FIELDS.CENTRAL_SERVER_SECRET}
                    type="text"
                    component={TextField}
                    label={<FormattedMessage id={`ui-inn-reach.${CENTRAL_SERVER_CONFIGURATION_FIELDS.CENTRAL_SERVER_SECRET}`} />}
                    validate={validateRequired}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={4}>
                  <Field name={CENTRAL_SERVER_CONFIGURATION_FIELDS.LOCAL_SERVER_KEY}>
                    {({ input }) => {
                      onChangeLocalServerKey = input.onChange;

                      return (
                        <>
                          <Label htmlFor={CENTRAL_SERVER_CONFIGURATION_FIELDS.LOCAL_SERVER_KEY}>
                            <FormattedMessage id={`ui-inn-reach.${CENTRAL_SERVER_CONFIGURATION_FIELDS.LOCAL_SERVER_KEY}`} />
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
                      );
                    }}
                  </Field>
                </Col>
                <Col xs={4}>
                  <Field name={CENTRAL_SERVER_CONFIGURATION_FIELDS.LOCAL_SERVER_SECRET}>
                    {({ input }) => {
                      onChangeLocalServerSecret = input.onChange;

                      return (
                        <>
                          <Label htmlFor={CENTRAL_SERVER_CONFIGURATION_FIELDS.LOCAL_SERVER_SECRET}>
                            <FormattedMessage id={`ui-inn-reach.${CENTRAL_SERVER_CONFIGURATION_FIELDS.LOCAL_SERVER_SECRET}`} />
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
                      );
                    }}
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
                    <FormattedMessage id="ui-inn-reach.generateKeypair" />
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
  data: PropTypes.object.isRequired,
  dirtyFieldsSinceLastSubmit: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  hasValidationErrors: PropTypes.bool.isRequired,
  isCentralServerDataInvalid: PropTypes.bool.isRequired,
  saveLocalServerKeypair: PropTypes.func.isRequired,
  copy: PropTypes.bool,
  initialValues: PropTypes.object,
  instanceSource: PropTypes.string,
  pristine: PropTypes.bool,
  resources: PropTypes.shape({
    blockedFields: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }),
  submitting: PropTypes.bool,
  onCancel: PropTypes.func,
  onClose: PropTypes.func,
};
CentralConfigurationForm.defaultProps = {
  initialValues: {},
  instanceSource: 'FOLIO',
};

export default stripesFinalForm({
  validate,
  subscription: {
    hasValidationErrors: true,
    error: true,
    dirtyFieldsSinceLastSubmit: true,
    submitSucceeded: true,
  },
  initialValuesEqual: (a, b) => isEqual(a, b),
  navigationCheck: true,
})(CentralConfigurationForm);
