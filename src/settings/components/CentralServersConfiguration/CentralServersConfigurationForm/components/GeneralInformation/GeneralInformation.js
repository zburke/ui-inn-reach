import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';
import {
  Accordion,
  Col,
  Row,
  Select,
  TextArea,
  TextField,
} from '@folio/stripes-components';
import {
  Field,
} from 'react-final-form';
import {
  required,
} from '../../../../../../utils';
import {
  validateServerCode,
} from '../../utils';
import TabularList from '../TabularList';
import {
  CENTRAL_SERVER_CONFIGURATION_FIELDS,
} from '../../../../../../constants';

const {
  NAME,
  DESCRIPTION,
  CENTRAL_SERVER_CODE,
  LOCAL_SERVER_CODE,
  LOAN_TYPE_ID,
} = CENTRAL_SERVER_CONFIGURATION_FIELDS;

const GeneralInformation = ({
  section,
  librariesTypeOptions,
  loanTypeOptions,
  onToggleSection,
}) => {
  return (
    <Accordion
      label={
        <h3>
          <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.accordion.generalInformation.title" />
        </h3>
      }
      id="section1"
      open={section}
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
      <TabularList librariesTypeOptions={librariesTypeOptions} />
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
  );
};

GeneralInformation.propTypes = {
  section: PropTypes.bool.isRequired,
  onToggleSection: PropTypes.func.isRequired,
  librariesTypeOptions: PropTypes.arrayOf(PropTypes.object),
  loanTypeOptions: PropTypes.arrayOf(PropTypes.object),
};

export default GeneralInformation;
