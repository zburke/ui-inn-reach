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
} from '../../../../../utils';

const ReceiveUnshippedItemModal = ({
  intl,
  pristine,
  handleSubmit,
  onTriggerModal,
}) => {
  const footer = (
    <ModalFooter>
      <Button
        marginBottom0
        disabled={pristine}
        buttonStyle="primary"
        onClick={handleSubmit}
      >
        <FormattedMessage id="ui-inn-reach.unshipped-item.button.submit" />
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      open
      dismissible
      size="small"
      label={<FormattedMessage id="ui-inn-reach.unshipped-item.modal.title" />}
      footer={footer}
      onClose={onTriggerModal}
    >
      <form onSubmit={handleSubmit}>
        <Row>
          <Col xs={6}>
            <Field
              required
              autoFocus
              data-testid="itemBarcode"
              name="itemBarcode"
              placeholder={intl.formatMessage({ id: 'ui-inn-reach.unshipped-item.placeholder.enter-item-barcode' })}
              validate={required}
              component={TextField}
            />
          </Col>
        </Row>
      </form>
    </Modal>
  );
};

ReceiveUnshippedItemModal.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  pristine: PropTypes.bool.isRequired,
  onTriggerModal: PropTypes.func.isRequired,
};

export default stripesFinalForm({})(ReceiveUnshippedItemModal);
