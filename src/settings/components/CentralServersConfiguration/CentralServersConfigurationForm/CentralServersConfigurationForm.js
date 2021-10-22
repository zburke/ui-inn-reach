import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  isEqual,
} from 'lodash';
import { FormattedMessage } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';

import {
  Pane,
  Row,
  Col,
  ExpandAllButton,
} from '@folio/stripes-components';
import stripesFinalForm from '@folio/stripes/final-form';
import {
  CentralServersConfigurationContext,
} from '../../../../contexts';
import {
  validateLocalAgency,
  getLibOptions,
  getLoanTypeOptions,
} from './utils';
import {
  CENTRAL_SERVER_CONFIGURATION_FIELDS,
  FILL_PANE_WIDTH,
} from '../../../../constants';
import {
  Footer,
  GeneralInformation,
  ServerConnection,
} from './components';
import styles from './CentralServersConfigurationForm.css';

const {
  LOCAL_SERVER_KEY,
  LOCAL_SERVER_SECRET,
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
  const loanTypeOptions = useMemo(() => getLoanTypeOptions(loanTypes), [loanTypes]);
  const librariesTypeOptions = useMemo(() => getLibOptions(folioLibraries), [folioLibraries]);

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

    return <FormattedMessage id={titleTranslationKey} />;
  };

  const renderFooter = (
    <Footer
      invalid={invalid}
      pristine={pristine}
      onCancel={onCancel}
      onHandleSubmit={handleSubmit}
    />
  );

  return (
    <form
      data-testid="central-server-configuration-form"
      className={styles.instanceForm}
    >
      <Pane
        dismissible
        centerContent
        defaultWidth={FILL_PANE_WIDTH}
        footer={renderFooter}
        paneTitle={getPaneTitle()}
        onClose={onCancel}
      >
        <div>
          <Row end="xs">
            <Col xs>
              <ExpandAllButton
                accordionStatus={sections}
                onToggle={setSections}
              />
            </Col>
          </Row>
          <GeneralInformation
            section={sections.section1}
            librariesTypeOptions={librariesTypeOptions}
            loanTypeOptions={loanTypeOptions}
            onToggleSection={onToggleSection}
          />
          <ServerConnection
            section={sections.section2}
            secretFieldType={secretFieldType}
            isEditMode={isEditMode}
            isSecretFieldsHaveMask={isSecretFieldsHaveMask}
            onGenerateKeyAndSecret={generateKeyAndSecret}
            onToggleSecretMask={toggleSecretMask}
            onToggleSection={onToggleSection}
          />
        </div>
      </Pane>
    </form>
  );
};

CentralConfigurationForm.propTypes = {
  form: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  invalid: PropTypes.bool.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  showPrevLocalServerValue: PropTypes.bool,
  onChangePristineState: PropTypes.func,
  onShowPreviousLocalServerValue: PropTypes.func,
};

export default stripesFinalForm({
  validate,
  subscription: {
    invalid: true,
    values: true,
  },
  initialValuesEqual: (a, b) => isEqual(a, b),
})(CentralConfigurationForm);
