import {
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';

import {
  Modal,
  ModalFooter,
  Button,
  Checkbox,
  Row,
  Col,
} from '@folio/stripes-components';

import {
  PrintButton,
} from '../../../common';
import css from './ConfirmStatusModal.css';

const ConfirmStatusModal = ({
  open,
  label,
  showPrintButton,
  isPrintable,
  slipTemplate,
  slipData,
  message,
  onAfterPrint,
  onClose,
}) => {
  const [isPrint, setIsPrint] = useState(isPrintable);

  const messageParts = message.map((messagePart, index) => (
    <p
      key={index}
      className={css.modalMessage}
    >
      {messagePart}
    </p>
  ));

  const triggerPrintBarcodeSlip = () => {
    setIsPrint(prev => !prev);
  };

  const footer = (
    <ModalFooter>
      {isPrint
        ?
          <PrintButton
            marginBottom0
            data-testid="print-button"
            buttonStyle="primary"
            dataSource={slipData}
            template={slipTemplate}
            onBeforePrint={onClose}
            onAfterPrint={onAfterPrint}
          >
            <FormattedMessage id="ui-inn-reach.shipped-items.modal.button.close" />
          </PrintButton>
        :
          <Button
            marginBottom0
            data-testid="close-button"
            buttonStyle="primary"
            onClick={onClose}
          >
            <FormattedMessage id="ui-inn-reach.shipped-items.modal.button.close" />
          </Button>
      }
    </ModalFooter>
  );

  return (
    <Modal
      dismissible
      open={open}
      label={label}
      size="small"
      footer={footer}
      onClose={onClose}
    >
      {messageParts}
      {showPrintButton &&
        <Row>
          <Col xs>
            <Checkbox
              checked={isPrint}
              name="printBarcodeSlip"
              label={<FormattedMessage id="ui-inn-reach.shipped-items.field.print-barcode-slip" />}
              value={isPrint + ''}
              onChange={triggerPrintBarcodeSlip}
            />
          </Col>
        </Row>
      }
    </Modal>
  );
};

ConfirmStatusModal.propTypes = {
  label: PropTypes.node.isRequired,
  message: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  isPrintable: PropTypes.bool,
  open: PropTypes.bool,
  showPrintButton: PropTypes.bool,
  slipData: PropTypes.object,
  slipTemplate: PropTypes.string,
  onAfterPrint: PropTypes.func,
};

ConfirmStatusModal.defaultProps = {
  open: true,
  slipTemplate: '',
};

export default ConfirmStatusModal;
