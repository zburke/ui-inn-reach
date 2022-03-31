import React, {
  useEffect,
} from 'react';
import {
  isEqual,
} from 'lodash';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import {
  Field,
} from 'react-final-form';

import {
  Pane,
  Button,
  PaneFooter,
  Label,
  MessageBanner,
  Checkbox,
  Layout,
  MultiSelection,
  Selection,
  Loading,
} from '@folio/stripes-components';
import stripesFinalForm from '@folio/stripes/final-form';

import {
  CENTRAL_SERVER_ID,
  DEFAULT_PANE_WIDTH,
  DEFAULT_PATRON_IDENTIFIERS,
  VISIBLE_PATRON_ID_FIELDS,
} from '../../../../constants';
import {
  validateVisiblePatronIdFields,
} from './utils';

const {
  IDENTIFIERS,
  CUSTOM,
} = VISIBLE_PATRON_ID_FIELDS;

const VisiblePatronIdForm = ({
  selectedServer,
  serverOptions,
  customFieldPatronOptions,
  visiblePatronIdConfiguration,
  isVisiblePatronIdConfigurationPending,
  isCheckedUserCustomField,
  form,
  invalid,
  pristine,
  onChangeServer,
  onChangeUserCustomCheckbox,
}) => {
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (!isCheckedUserCustomField) {
      form.change(CUSTOM, undefined);
    }
  }, [isCheckedUserCustomField]);

  const getFooter = () => {
    const saveButton = (
      <Button
        marginBottom0
        buttonStyle="primary mega"
        type="submit"
        disabled={invalid || pristine}
        onClick={form.submit}
      >
        <FormattedMessage id="ui-inn-reach.settings.visible-patron-id.button.save" />
      </Button>
    );

    return <PaneFooter renderEnd={saveButton} />;
  };

  return (
    <Pane
      defaultWidth={DEFAULT_PANE_WIDTH}
      footer={getFooter()}
      paneTitle={<FormattedMessage id='ui-inn-reach.settings.visible-patron-id.title' />}
    >
      <form>
        <Selection
          id={CENTRAL_SERVER_ID}
          label={<FormattedMessage id="ui-inn-reach.settings.field.centralServer" />}
          dataOptions={serverOptions}
          placeholder={formatMessage({ id: 'ui-inn-reach.settings.placeholder.centralServer' })}
          value={selectedServer.name}
          onChange={onChangeServer}
        />
        {isVisiblePatronIdConfigurationPending && <Loading />}
        {visiblePatronIdConfiguration &&
          <Field name={IDENTIFIERS}>
            {({ meta }) => (
              <>
                <Label required>
                  <FormattedMessage id="ui-inn-reach.settings.visible-patron-id.label.patron-ids" />
                </Label>
                {meta.error &&
                  <MessageBanner type="error">
                    {meta.error}
                  </MessageBanner>
                }
                {DEFAULT_PATRON_IDENTIFIERS.map(identifier => (
                  <Field
                    id={identifier}
                    key={identifier}
                    type="checkbox"
                    label={<FormattedMessage id={`ui-inn-reach.settings.visible-patron-id.field.${identifier}`} />}
                    name={identifier}
                    component={Checkbox}
                  />
                ))}
                <Checkbox
                  label={<FormattedMessage id="ui-inn-reach.settings.visible-patron-id.field.user-custom-fields" />}
                  checked={isCheckedUserCustomField}
                  onChange={onChangeUserCustomCheckbox}
                />
                {isCheckedUserCustomField &&
                  <Layout className="margin-start-gutter">
                    <Field
                      name={CUSTOM}
                      component={MultiSelection}
                      dataOptions={customFieldPatronOptions}
                      emptyMessage={formatMessage({ id: 'ui-inn-reach.settings.visible-patron-id.no-valid-fields-are-defined' })}
                      placeholder={formatMessage({ id: 'ui-inn-reach.settings.visible-patron-id.placeholder.none' })}
                    />
                  </Layout>
                }
              </>
            )}
          </Field>
        }
      </form>
    </Pane>
  );
};

VisiblePatronIdForm.propTypes = {
  customFieldPatronOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  form: PropTypes.object.isRequired,
  invalid: PropTypes.bool.isRequired,
  isCheckedUserCustomField: PropTypes.bool.isRequired,
  isVisiblePatronIdConfigurationPending: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  selectedServer: PropTypes.object.isRequired,
  serverOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChangeServer: PropTypes.func.isRequired,
  onChangeUserCustomCheckbox: PropTypes.func.isRequired,
  visiblePatronIdConfiguration: PropTypes.object,
};

export default stripesFinalForm({
  initialValuesEqual: isEqual,
  navigationCheck: true,
  validate: validateVisiblePatronIdFields,
  subscription: {
    invalid: true,
  },
})(VisiblePatronIdForm);
