import React, {
  useEffect,
  useState,
} from 'react';
import {
  Field,
} from 'react-final-form';
import {
  isEqual,
} from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Button,
  Loading,
  Pane,
  PaneFooter,
  Selection,
} from '@folio/stripes-components';

import {
  AGENCY_TO_FOLIO_LOCATIONS_FIELDS,
  DEFAULT_PANE_WIDTH,
} from '../../../../constants';
import {
  TabularList,
} from './components';
import {
  getFolioLocationOptions,
  getLocalServerData,
} from '../../../routes/AgencyToFolioLocations/utils';

import css from './AgencyToFolioLocationsForm.css';

const validateRequired = (value) => {
  return value
    ? undefined
    : <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.validation.required" />;
};

const {
  CENTRAL_SERVER_ID,
  LIBRARY_ID,
  LOCATION_ID,
  LOCAL_CODE,
  LOCAL_SERVER_LIBRARY_ID,
  LOCAL_SERVER_LOCATION_ID,
  AGENCY_CODE_MAPPINGS,
} = AGENCY_TO_FOLIO_LOCATIONS_FIELDS;

const AgencyToFolioLocationsForm = ({
  selectedServer,
  serverOptions,
  isLocalServersPending,
  libraryOptions,
  localServers,
  folioLocationsMap,
  agencyMappings,
  formatMessage,
  initialValues,
  isResetForm,
  handleSubmit,
  values,
  form,
  onChangeServer,
  onChangeLocalServer,
  onChangePristineState,
  onChangeFormResetState,
}) => {
  const [localServerOptions, setLocalServerOptions] = useState([]);
  const [serverLocationOptions, setServerLocationOptions] = useState([]);
  const [localServerLocationOptions, setLocalServerLocationOptions] = useState([]);

  const isLibraryChanged = values[LIBRARY_ID] && (values[LIBRARY_ID] !== agencyMappings[LIBRARY_ID]);
  const isLocationChanged = values[LOCATION_ID] && (values[LOCATION_ID] !== agencyMappings[LOCATION_ID]);
  const isLocalServerLibraryChanged = values[LOCAL_SERVER_LIBRARY_ID] &&
    (values[LOCAL_SERVER_LIBRARY_ID] !== initialValues[LOCAL_SERVER_LIBRARY_ID]);
  const isLocalServerLocationChanged = values[LOCAL_SERVER_LOCATION_ID] &&
    (values[LOCAL_SERVER_LOCATION_ID] !== initialValues[LOCAL_SERVER_LOCATION_ID]);
  const isAgencyCodeMappingsChanged = values[LOCAL_CODE] &&
    !isEqual(initialValues[AGENCY_CODE_MAPPINGS], values[AGENCY_CODE_MAPPINGS]);

  const isPristine = !(
    isLibraryChanged ||
    isLocationChanged ||
    isLocalServerLibraryChanged ||
    isLocalServerLocationChanged ||
    isAgencyCodeMappingsChanged
  );

  const handleChangeServerLibrary = (libraryId) => {
    if (values[LIBRARY_ID] === libraryId) return;

    form.change(LIBRARY_ID, libraryId);

    if (agencyMappings[LIBRARY_ID] === libraryId) {
      form.change(LOCATION_ID, agencyMappings[LOCATION_ID]);
    } else {
      form.change(LOCATION_ID, undefined);
    }
  };

  const handleChangeServerLocation = (locationId) => {
    if (values[LOCATION_ID] === locationId) return;

    form.change(LOCATION_ID, locationId);
  };

  const handleChangeLocalServer = (localCode) => {
    if (values[LOCAL_CODE] === localCode) return;

    onChangeLocalServer(localCode, values[LIBRARY_ID], values[LOCATION_ID]);
    form.change(LOCAL_SERVER_LIBRARY_ID, undefined);
    form.change(LOCAL_SERVER_LOCATION_ID, undefined);
    form.change(AGENCY_CODE_MAPPINGS, undefined);
    form.change(LOCAL_CODE, localCode);
  };

  const handleChangeLocalServerLibrary = (libraryId) => {
    if (values[LOCAL_SERVER_LIBRARY_ID] === libraryId) return;

    const locOptions = getFolioLocationOptions(folioLocationsMap, libraryId);
    const locServerData = getLocalServerData(agencyMappings, initialValues[LOCAL_CODE]);

    form.change(LOCAL_SERVER_LIBRARY_ID, libraryId);

    if (locServerData?.[LOCAL_SERVER_LIBRARY_ID] === libraryId) {
      form.change(LOCAL_SERVER_LOCATION_ID, locServerData[LOCAL_SERVER_LOCATION_ID]);
    } else {
      form.change(LOCAL_SERVER_LOCATION_ID, undefined);
    }
    setLocalServerLocationOptions(locOptions);
  };

  const handleChangeLocalServerLocation = (locationId) => {
    if (values[LOCAL_SERVER_LOCATION_ID] === locationId) return;

    form.change(LOCAL_SERVER_LOCATION_ID, locationId);
  };

  useEffect(() => {
    const { localServerList } = localServers;

    if (localServerList) {
      const localServerOpts = localServerList.map(({ localCode, description }) => ({
        label: `${localCode} (${description})`,
        value: localCode,
      }));

      setLocalServerOptions(localServerOpts);
    }
  }, [localServers]);

  useEffect(() => {
    if (values[LIBRARY_ID]) {
      const locOptions = getFolioLocationOptions(folioLocationsMap, values[LIBRARY_ID]);

      setServerLocationOptions(locOptions);
    }
  }, [values[LIBRARY_ID]]);

  useEffect(() => {
    if (values[LOCAL_SERVER_LIBRARY_ID]) {
      const locOptions = getFolioLocationOptions(folioLocationsMap, values[LOCAL_SERVER_LIBRARY_ID]);

      setLocalServerLocationOptions(locOptions);
    }
  }, [values[LOCAL_SERVER_LIBRARY_ID]]);

  useEffect(() => {
    onChangePristineState(isPristine);
  }, [isPristine]);

  useEffect(() => {
    if (isResetForm) {
      form.reset();
      onChangeFormResetState(false);
    }
  }, [isResetForm]);

  const getFooter = () => {
    const enabled = values[LOCAL_CODE]
      ? !isPristine
      : isLibraryChanged && isLocationChanged;

    const saveButton = (
      <Button
        marginBottom0
        buttonStyle="primary small"
        type="submit"
        disabled={!enabled}
        onClick={handleSubmit}
      >
        <FormattedMessage id="ui-inn-reach.settings.agency-to-folio-locations.button.save" />
      </Button>
    );

    return <PaneFooter renderEnd={saveButton} />;
  };

  return (
    <Pane
      defaultWidth={DEFAULT_PANE_WIDTH}
      footer={getFooter()}
      paneTitle={<FormattedMessage id="ui-inn-reach.settings.agency-to-folio-locations.title" />}
    >
      <form className={css.form}>
        <Selection
          required
          id={CENTRAL_SERVER_ID}
          label={<FormattedMessage id="ui-inn-reach.settings.agency-to-folio-locations.field.central-server" />}
          dataOptions={serverOptions}
          placeholder={formatMessage({ id: 'ui-inn-reach.settings.agency-to-folio-locations.placeholder.central-server' })}
          value={selectedServer.id}
          onChange={onChangeServer}
        />
        {isLocalServersPending && <Loading />}
        {selectedServer.id && !isLocalServersPending &&
          <>
            <Field
              required
              name={LIBRARY_ID}
              component={Selection}
              label={<FormattedMessage id="ui-inn-reach.settings.agency-to-folio-locations.field.folio-library" />}
              dataOptions={libraryOptions}
              placeholder={formatMessage({ id: 'ui-inn-reach.settings.agency-to-folio-locations.placeholder.folio-library' })}
              onChange={handleChangeServerLibrary}
            />
            <Field
              required
              disabled={!values[LIBRARY_ID]}
              name={LOCATION_ID}
              component={Selection}
              label={<FormattedMessage id="ui-inn-reach.settings.agency-to-folio-locations.field.folio-location" />}
              dataOptions={serverLocationOptions}
              placeholder={formatMessage({ id: 'ui-inn-reach.settings.agency-to-folio-locations.placeholder.folio-location' })}
              validate={validateRequired}
              onChange={handleChangeServerLocation}
            />
          </>
        }
        {((values[LOCATION_ID] && !isLocalServersPending) || values[LOCAL_CODE]) &&
          <Field
            name={LOCAL_CODE}
            component={Selection}
            label={<FormattedMessage id="ui-inn-reach.settings.agency-to-folio-locations.field.local-server" />}
            dataOptions={localServerOptions}
            placeholder={formatMessage({ id: 'ui-inn-reach.settings.agency-to-folio-locations.placeholder.local-server' })}
            onChange={handleChangeLocalServer}
          />
        }
        {values[LOCAL_CODE] &&
          <>
            <Field
              name={LOCAL_SERVER_LIBRARY_ID}
              component={Selection}
              label={<FormattedMessage id="ui-inn-reach.settings.agency-to-folio-locations.field.folio-library" />}
              dataOptions={libraryOptions}
              placeholder={formatMessage({ id: 'ui-inn-reach.settings.agency-to-folio-locations.placeholder.folio-library' })}
              onChange={handleChangeLocalServerLibrary}
            />
            <Field
              disabled={!values[LOCAL_SERVER_LIBRARY_ID]}
              name={LOCAL_SERVER_LOCATION_ID}
              component={Selection}
              label={<FormattedMessage id="ui-inn-reach.settings.agency-to-folio-locations.field.folio-location" />}
              dataOptions={localServerLocationOptions}
              placeholder={formatMessage({ id: 'ui-inn-reach.settings.agency-to-folio-locations.placeholder.folio-location' })}
              onChange={handleChangeLocalServerLocation}
            />
            <TabularList
              initialValues={initialValues}
              folioLocationsMap={folioLocationsMap}
              librariesOptions={libraryOptions}
            />
          </>
        }
      </form>
    </Pane>
  );
};

AgencyToFolioLocationsForm.propTypes = {
  agencyMappings: PropTypes.shape({
    libraryId: PropTypes.string,
    locationId: PropTypes.string,
    localServers: PropTypes.arrayOf(PropTypes.shape({
      localCode: PropTypes.string,
      localServerLibraryId: PropTypes.string,
      localServerLocationId: PropTypes.string,
      agencyCodeMappings: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        agencyCode: PropTypes.string,
        libraryId: PropTypes.string,
        locationId: PropTypes.string,
      })),
    })),
  }).isRequired,
  form: PropTypes.object.isRequired,
  formatMessage: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  isLocalServersPending: PropTypes.bool.isRequired,
  isResetForm: PropTypes.bool.isRequired,
  libraryOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  localServers: PropTypes.shape({
    errors: PropTypes.array,
    localServerList: PropTypes.arrayOf(PropTypes.shape({
      agencyList: PropTypes.arrayOf(PropTypes.shape({
        agencyCode: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
      })).isRequired,
      description: PropTypes.string.isRequired,
      localCode: PropTypes.string.isRequired,
    })),
    reason: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  selectedServer: PropTypes.object.isRequired,
  serverOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  values: PropTypes.object.isRequired,
  onChangeFormResetState: PropTypes.func.isRequired,
  onChangeLocalServer: PropTypes.func.isRequired,
  onChangePristineState: PropTypes.func.isRequired,
  onChangeServer: PropTypes.func.isRequired,
  folioLocationsMap: PropTypes.object,
};

export default stripesFinalForm({
  subscription: {
    values: true,
  },
})(AgencyToFolioLocationsForm);
