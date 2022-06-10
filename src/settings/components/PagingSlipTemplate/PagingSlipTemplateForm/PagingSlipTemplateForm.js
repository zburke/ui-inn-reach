import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import {
  Field,
} from 'react-final-form';

import {
  TemplateEditor,
} from '@folio/stripes-template-editor';
import {
  Pane,
  Button,
  PaneFooter,
  Selection,
  Loading,
  TextArea,
} from '@folio/stripes-components';
import stripesFinalForm from '@folio/stripes/final-form';

import css from './PagingSlipTemplateForm.css';

import {
  CENTRAL_SERVER_ID,
  DEFAULT_PANE_WIDTH,
  PAGING_SLIP_TEMPLATE_FIELDS,
} from '../../../../constants';

const {
  DESCRIPTION,
  TEMPLATE,
} = PAGING_SLIP_TEMPLATE_FIELDS;

const PagingSlipTemplateForm = ({
  selectedServer,
  serverOptions,
  pagingSlipTemplate,
  isPagingSlipTemplatePending,
  pristine,
  submitting,
  handleSubmit,
  onChangeServer,
}) => {
  const { formatMessage } = useIntl();

  const getFooter = () => {
    const saveButton = (
      <Button
        marginBottom0
        buttonStyle="primary mega"
        type="submit"
        disabled={pristine || submitting}
        onClick={handleSubmit}
      >
        <FormattedMessage id="ui-inn-reach.settings.paging-slip-template.button.save" />
      </Button>
    );

    return <PaneFooter renderEnd={saveButton} />;
  };

  return (
    <Pane
      defaultWidth={DEFAULT_PANE_WIDTH}
      footer={getFooter()}
      paneTitle={<FormattedMessage id='ui-inn-reach.settings.paging-slip-template.title' />}
    >
      <form
        className={css.form}
      >
        <Selection
          id={CENTRAL_SERVER_ID}
          label={<FormattedMessage id="ui-inn-reach.settings.field.centralServer" />}
          dataOptions={serverOptions}
          placeholder={formatMessage({ id: 'ui-inn-reach.settings.placeholder.centralServer' })}
          value={selectedServer.name}
          onChange={onChangeServer}
        />
        {isPagingSlipTemplatePending && <Loading />}
        {pagingSlipTemplate &&
          <>
            <Field
              label={formatMessage({ id: 'ui-inn-reach.settings.paging-slip-template.field.description' })}
              name={DESCRIPTION}
              component={TextArea}
            />
            <Field
              printable
              label={formatMessage({ id: 'ui-inn-reach.settings.paging-slip-template.field.display' })}
              component={TemplateEditor}
              tokens={{}}
              name={TEMPLATE}
              previewModalHeader={formatMessage({ id: 'ui-inn-reach.settings.paging-slip-template.button.preview' })}
              tokensList={() => <div />}
            />
          </>
        }
      </form>
    </Pane>
  );
};

PagingSlipTemplateForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  isPagingSlipTemplatePending: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  selectedServer: PropTypes.object.isRequired,
  serverOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  submitting: PropTypes.bool.isRequired,
  onChangeServer: PropTypes.func.isRequired,
  pagingSlipTemplate: PropTypes.object,
};

export default stripesFinalForm({
  navigationCheck: true,
})(PagingSlipTemplateForm);
