import React from 'react';
import PropTypes from 'prop-types';
import {
  isEqual,
} from 'lodash';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Pluggable,
} from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';
import {
  Button,
  Loading,
  Pane,
  PaneFooter,
  Selection,
  TextField,
} from '@folio/stripes-components';
import {
  CENTRAL_SERVER_ID,
  DEFAULT_PANE_WIDTH,
  INN_REACH_RECALL_USER_FIELDS,
} from '../../../../constants';
import {
  DebouncingValidatingField,
} from '../../common';
import {
  validateUserId,
} from './utils';

const {
  RECALL_INN_REACH_ITEMS_AS_USER,
} = INN_REACH_RECALL_USER_FIELDS;

const InnReachRecallUserForm = ({
  selectedServer,
  serverOptions,
  innReachRecallUser,
  isInnReachRecallUserPending,
  parentMutator,
  handleSubmit,
  pristine,
  invalid,
  form,
  onChangeServer,
}) => {
  const { formatMessage } = useIntl();

  const getFooter = () => {
    const saveButton = (
      <Button
        marginBottom0
        buttonStyle="primary mega"
        type="submit"
        disabled={pristine || invalid}
        onClick={handleSubmit}
      >
        <FormattedMessage id="ui-inn-reach.settings.inn-reach-recall-user.button.save" />
      </Button>
    );

    return <PaneFooter renderEnd={saveButton} />;
  };

  return (
    <Pane
      defaultWidth={DEFAULT_PANE_WIDTH}
      footer={getFooter()}
      paneTitle={<FormattedMessage id='ui-inn-reach.settings.inn-reach-recall-user.title' />}
    >
      <form onSubmit={event => { event.preventDefault(); }}>
        <Selection
          id={CENTRAL_SERVER_ID}
          label={<FormattedMessage id="ui-inn-reach.settings.field.centralServer" />}
          dataOptions={serverOptions}
          placeholder={formatMessage({ id: 'ui-inn-reach.settings.placeholder.centralServer' })}
          value={selectedServer.name}
          onChange={onChangeServer}
        />
        {isInnReachRecallUserPending && <Loading />}
        {selectedServer.id && innReachRecallUser && !isInnReachRecallUserPending &&
          <>
            <DebouncingValidatingField
              name={RECALL_INN_REACH_ITEMS_AS_USER}
              validate={validateUserId(parentMutator)}
            >
              {({ input, meta }) => (
                <TextField
                  {...input}
                  marginBottom0
                  id={RECALL_INN_REACH_ITEMS_AS_USER}
                  label={<FormattedMessage id="ui-inn-reach.settings.inn-reach-recall-user.field.recall-inn-reach-items-as-user" />}
                  error={meta.submitFailed ? meta.error : undefined}
                />
              )}
            </DebouncingValidatingField>
            <Pluggable
              marginTop0
              marginBottom0
              type="find-user"
              aria-haspopup="true"
              searchLabel={<FormattedMessage id="ui-inn-reach.patron-lookup" />}
              searchButtonStyle="link"
              selectUser={user => form.change(RECALL_INN_REACH_ITEMS_AS_USER, user.id)}
            />
          </>
        }
      </form>
    </Pane>
  );
};

InnReachRecallUserForm.propTypes = {
  form: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isInnReachRecallUserPending: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  selectedServer: PropTypes.object.isRequired,
  serverOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChangeServer: PropTypes.func.isRequired,
  innReachRecallUser: PropTypes.object,
  invalid: PropTypes.bool,
  parentMutator: PropTypes.shape({
    selectedServerId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    innReachRecallUser: PropTypes.shape({
      GET: PropTypes.func,
      POST: PropTypes.func,
      PUT: PropTypes.func,
    }).isRequired,
    users: PropTypes.shape({
      GET: PropTypes.func,
      POST: PropTypes.func,
      PUT: PropTypes.func,
    }).isRequired,
  }),
};

export default stripesFinalForm({
  initialValuesEqual: isEqual,
  navigationCheck: true,
  subscription: {
    pristine: true,
    valid: true,
  },
})(InnReachRecallUserForm);
