import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';
import {
  Field,
} from 'react-final-form';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Row,
  Col,
  Button,
  Modal,
  TextField,
  ModalFooter,
} from '@folio/stripes-components';

import {
  required,
} from '../../../../utils';

const ReportModal = ({
  heading,
  fieldLabel,
  fieldName,
  invalid,
  handleSubmit,
  form,
  onTriggerModal,
}) => {
  const footer = (
    <ModalFooter>
      <Button
        marginBottom0
        disabled={invalid}
        buttonStyle="primary"
        onClick={form.submit}
      >
        <FormattedMessage id="ui-inn-reach.reports.modal.button.save-and-close" />
      </Button>
      <Button
        marginBottom0
        buttonStyle="default"
        onClick={onTriggerModal}
      >
        <FormattedMessage id="ui-inn-reach.reports.modal.button.cancel" />
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      open
      dismissible
      size="small"
      label={heading}
      footer={footer}
      onClose={onTriggerModal}
    >
      <form onSubmit={handleSubmit}>
        <Row>
          <Col xs={6}>
            <Field
              required
              autoFocus
              type="number"
              initialValue={0}
              min={0}
              label={fieldLabel}
              name={fieldName}
              validate={required}
              component={TextField}
            />
          </Col>
        </Row>
      </form>
    </Modal>
  );
};

ReportModal.propTypes = {
  fieldLabel: PropTypes.object.isRequired,
  fieldName: PropTypes.string.isRequired,
  form: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  heading: PropTypes.object.isRequired,
  invalid: PropTypes.bool.isRequired,
  onTriggerModal: PropTypes.func.isRequired,
};

export default stripesFinalForm({
  subscription: {
    invalid: true,
  },
})(ReportModal);
