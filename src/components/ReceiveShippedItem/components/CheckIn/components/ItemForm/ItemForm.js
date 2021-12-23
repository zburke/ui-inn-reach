import React, {
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  Field,
} from 'react-final-form';
import {
  FormattedMessage,
} from 'react-intl';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Button,
  TextField,
  Row,
  Col,
} from '@folio/stripes-components';

const ItemForm = ({
  isLoading,
  pristine,
  intl,
  form,
  formRef,
  barcodeRef,
  handleSubmit,
}) => {
  useEffect(() => {
    formRef.current = form;
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <Row>
        <Col xs={3}>
          <Field
            autoFocus
            name="itemBarcode"
            inputRef={barcodeRef}
            placeholder={intl.formatMessage({ id: 'ui-inn-reach.shipped-items.placeholder.scan-or-enter-item-barcode' })}
            component={TextField}
          />
        </Col>
        <Button
          type="submit"
          disabled={pristine || isLoading}
        >
          <FormattedMessage id="ui-inn-reach.shipped-items.button.enter" />
        </Button>
      </Row>
    </form>
  );
};

ItemForm.propTypes = {
  barcodeRef: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  formRef: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
};

export default stripesFinalForm({
  navigationCheck: true,
})(ItemForm);
