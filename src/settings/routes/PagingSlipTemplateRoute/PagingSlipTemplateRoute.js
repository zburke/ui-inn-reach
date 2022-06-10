import {
  useEffect,
  useState,
} from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';
import {
  isEmpty,
  omit,
} from 'lodash';

import {
  stripesConnect,
} from '@folio/stripes/core';
import {
  LoadingPane,
} from '@folio/stripes-components';

import {
  PagingSlipTemplateForm,
} from '../../components';
import {
  useCallout,
  useCentralServers,
} from '../../../hooks';
import {
  CALLOUT_ERROR_TYPE,
  CENTRAL_SERVERS_LIMITING,
  METADATA,
  PAGING_SLIP_INITIAL_VALUES,
} from '../../../constants';

const PagingSlipTemplateRoute = ({
  resources: {
    centralServerRecords: {
      records: centralServers,
      isPending: isServersPending,
      hasLoaded: hasLoadedServers,
    },
  },
  mutator,
  history,
}) => {
  const servers = centralServers[0]?.centralServers || [];
  const showCallout = useCallout();
  const {
    serverOptions,
    selectedServer,
    handleServerChange,
  } = useCentralServers(history, servers);

  const [pagingSlipTemplate, setPagingSlipTemplate] = useState(null);
  const [isPagingSlipTemplatePending, setPagingSlipTemplatePending] = useState(false);
  const [initialValues, setInitialValues] = useState(PAGING_SLIP_INITIAL_VALUES);

  const fetchPagingSlipTemplate = () => {
    setPagingSlipTemplatePending(true);

    mutator.pagingSlipTemplate.GET()
      .then(response => {
        setInitialValues(response);
        setPagingSlipTemplate(response);
      })
      .catch(() => setPagingSlipTemplate({}))
      .finally(() => setPagingSlipTemplatePending(false));
  };

  const reset = () => {
    setInitialValues(PAGING_SLIP_INITIAL_VALUES);
    setPagingSlipTemplate(null);
  };

  const handleSubmit = (record) => {
    const payload = omit(record, METADATA);
    const action = isEmpty(pagingSlipTemplate) ? 'create' : 'update';

    mutator.pagingSlipTemplate.PUT(payload)
      .then(() => {
        setInitialValues(payload);
        showCallout({ message: <FormattedMessage id={`ui-inn-reach.settings.paging-slip-template.${action}.success`} /> });
      })
      .catch(() => {
        showCallout({ type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id={`ui-inn-reach.settings.paging-slip-template.callout.connectionProblem.${action}`} /> });
      });
  };

  useEffect(() => {
    if (selectedServer.id) {
      mutator.selectedServerId.replace(selectedServer.id);
      reset();
      fetchPagingSlipTemplate();
    }
  }, [selectedServer]);

  if (isServersPending && !hasLoadedServers) {
    return <LoadingPane />;
  }

  return (
    <PagingSlipTemplateForm
      selectedServer={selectedServer}
      serverOptions={serverOptions}
      initialValues={initialValues}
      pagingSlipTemplate={pagingSlipTemplate}
      isPagingSlipTemplatePending={isPagingSlipTemplatePending}
      onSubmit={handleSubmit}
      onChangeServer={handleServerChange}
    />
  );
};

PagingSlipTemplateRoute.manifest = Object.freeze({
  selectedServerId: { initialValue: '' },
  centralServerRecords: {
    type: 'okapi',
    path: `inn-reach/central-servers?limit=${CENTRAL_SERVERS_LIMITING}`,
    throwErrors: false,
  },
  pagingSlipTemplate: {
    type: 'okapi',
    path: 'inn-reach/central-servers/%{selectedServerId}/paging-slip-template',
    pk: '',
    clientGeneratePk: false,
    accumulate: true,
    fetch: false,
    throwErrors: false,
  },
});

PagingSlipTemplateRoute.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  resources: PropTypes.shape({
    selectedServerId: PropTypes.string,
    centralServerRecords: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
      isPending: PropTypes.bool.isRequired,
      hasLoaded: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    selectedServerId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    pagingSlipTemplate: PropTypes.shape({
      GET: PropTypes.func,
      POST: PropTypes.func,
      PUT: PropTypes.func,
    }).isRequired,
  }),
};

export default stripesConnect(PagingSlipTemplateRoute);
