import React, {
  useEffect,
  useRef,
  useMemo,
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
  getLocalServerData,
} from '../../../routes/AgencyToFolioLocations/utils';
import {
  getFolioLocationOptions,
  getLocalServerOptions,
  getSelectedOptionInfo,
  validateRequired,
} from './utils';

import css from './AgencyToFolioLocationsForm.css';

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
  serverLocationOptions,
  localServerLocationOptions,
  onChangeServer,
  onChangeLocalServer,
  onChangePristineState,
  onChangeFormResetState,
  onChangeServerLocationOptions,
  onChangeLocalServerLocationOptions,
}) => {
  const submitted = useRef(false);

  const isLibraryChanged = values[LIBRARY_ID] !== agencyMappings[LIBRARY_ID];
  const isLocationChanged = values[LOCATION_ID] !== agencyMappings[LOCATION_ID];
  const isLocalServerLibraryChanged = values[LOCAL_SERVER_LIBRARY_ID] !== initialValues[LOCAL_SERVER_LIBRARY_ID];
  const isLocalServerLocationChanged = values[LOCAL_SERVER_LOCATION_ID] !== initialValues[LOCAL_SERVER_LOCATION_ID];
  const isAgencyCodeMappingsChanged = values[LOCAL_CODE] &&
    !isEqual(initialValues[AGENCY_CODE_MAPPINGS], values[AGENCY_CODE_MAPPINGS]);

  const isServerFieldsChanged = isLibraryChanged || isLocationChanged;
  const isLocalServerFieldsChanged = values[LOCAL_CODE] &&
    (isLocalServerLibraryChanged || isLocalServerLocationChanged || isAgencyCodeMappingsChanged);

  const isPristine = !(
    isLibraryChanged ||
    isLocationChanged ||
    isLocalServerLibraryChanged ||
    isLocalServerLocationChanged ||
    isAgencyCodeMappingsChanged
  );

  const localServerOptions = useMemo(() => getLocalServerOptions(localServers), [localServers]);

  const handleChangeServer = (serverName) => {
    submitted.current = false;
    onChangeServer(serverName);
  };

  const handleChangeServerLibrary = (libraryId) => {
    if (values[LIBRARY_ID] === libraryId) return;

    const {
      isNoValueOption,
      selectedValue: selectedLibraryId,
    } = getSelectedOptionInfo(libraryId);

    const locOptions = isNoValueOption
      ? []
      : getFolioLocationOptions(folioLocationsMap, libraryId);

    form.change(LIBRARY_ID, selectedLibraryId);
    submitted.current = false;
    onChangeServerLocationOptions(locOptions);

    if (agencyMappings[LIBRARY_ID] === libraryId) {
      form.change(LOCATION_ID, agencyMappings[LOCATION_ID]);
    } else {
      form.change(LOCATION_ID, undefined);
    }
  };

  const handleChangeServerLocation = (locationId) => {
    if (values[LOCATION_ID] === locationId) return;

    const { selectedValue: selectedLocationId } = getSelectedOptionInfo(locationId);

    form.change(LOCATION_ID, selectedLocationId);
    submitted.current = false;
  };

  const handleChangeLocalServer = (localCode) => {
    if (values[LOCAL_CODE] === localCode) return;

    const {
      isNoValueOption,
      selectedValue: selectedLocalCode,
    } = getSelectedOptionInfo(localCode);

    onChangeLocalServer(localCode, values[LIBRARY_ID], values[LOCATION_ID], isNoValueOption);
    form.change(LOCAL_SERVER_LIBRARY_ID, undefined);
    form.change(LOCAL_SERVER_LOCATION_ID, undefined);
    form.change(AGENCY_CODE_MAPPINGS, undefined);
    form.change(LOCAL_CODE, selectedLocalCode);
  };

  const handleChangeLocalServerLibrary = (libraryId) => {
    if (values[LOCAL_SERVER_LIBRARY_ID] === libraryId) return;

    const {
      isNoValueOption,
      selectedValue: selectedLocalServerLibrary,
    } = getSelectedOptionInfo(libraryId);

    const locOptions = isNoValueOption
      ? []
      : getFolioLocationOptions(folioLocationsMap, libraryId);

    let locServerData;

    if (!isNoValueOption) {
      locServerData = getLocalServerData(agencyMappings, initialValues[LOCAL_CODE]);
    }

    form.change(LOCAL_SERVER_LIBRARY_ID, selectedLocalServerLibrary);
    onChangeLocalServerLocationOptions(locOptions);

    if (locServerData?.[LOCAL_SERVER_LIBRARY_ID] === libraryId) {
      form.change(LOCAL_SERVER_LOCATION_ID, locServerData[LOCAL_SERVER_LOCATION_ID]);
    } else {
      form.change(LOCAL_SERVER_LOCATION_ID, undefined);
    }
  };

  const handleChangeLocalServerLocation = (locationId) => {
    if (values[LOCAL_SERVER_LOCATION_ID] === locationId) return;

    const { selectedValue: selectedLocalServerLocation } = getSelectedOptionInfo(locationId);

    form.change(LOCAL_SERVER_LOCATION_ID, selectedLocalServerLocation);
  };

  const handleSave = (event) => {
    submitted.current = true;
    handleSubmit(event);
  };

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
    const enabled = (values[LIBRARY_ID] && values[LOCATION_ID] && isServerFieldsChanged) ||
      isLocalServerFieldsChanged || (isServerFieldsChanged && values[LOCAL_CODE]);

    const saveButton = (
      <Button
        marginBottom0
        buttonStyle="primary mega"
        type="submit"
        disabled={!enabled}
        onClick={handleSave}
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
          id={CENTRAL_SERVER_ID}
          label={<FormattedMessage id="ui-inn-reach.settings.agency-to-folio-locations.field.central-server" />}
          dataOptions={serverOptions}
          placeholder={formatMessage({ id: 'ui-inn-reach.settings.agency-to-folio-locations.placeholder.central-server' })}
          value={selectedServer.name}
          onChange={handleChangeServer}
        />
        {isLocalServersPending && <Loading />}
        {selectedServer.id && !isLocalServersPending &&
          <>
            <Field
              name={LIBRARY_ID}
              validate={validateRequired}
            >
              {({ input, meta }) => (
                <Selection
                  {...input}
                  required
                  id={LIBRARY_ID}
                  label={<FormattedMessage id="ui-inn-reach.settings.agency-to-folio-locations.field.folio-library" />}
                  dataOptions={libraryOptions}
                  placeholder={formatMessage({ id: 'ui-inn-reach.settings.agency-to-folio-locations.placeholder.folio-library' })}
                  error={submitted.current ? meta.error : undefined}
                  onChange={handleChangeServerLibrary}
                />
              )}
            </Field>
            <Field
              name={LOCATION_ID}
              validate={validateRequired}
            >
              {({ input, meta }) => (
                <Selection
                  {...input}
                  required
                  id={LOCATION_ID}
                  disabled={!values[LIBRARY_ID]}
                  label={<FormattedMessage id="ui-inn-reach.settings.agency-to-folio-locations.field.folio-location" />}
                  dataOptions={serverLocationOptions}
                  placeholder={formatMessage({ id: 'ui-inn-reach.settings.agency-to-folio-locations.placeholder.folio-location' })}
                  error={submitted.current ? meta.error : undefined}
                  onChange={handleChangeServerLocation}
                />
              )}
            </Field>
          </>
        }
        {((values[LOCATION_ID] && !isLocalServersPending) || values[LOCAL_CODE]) &&
          <Field
            id={LOCAL_CODE}
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
              id={LOCAL_SERVER_LIBRARY_ID}
              data-testid={LOCAL_SERVER_LIBRARY_ID}
              name={LOCAL_SERVER_LIBRARY_ID}
              component={Selection}
              label={<FormattedMessage id="ui-inn-reach.settings.agency-to-folio-locations.field.folio-library" />}
              dataOptions={libraryOptions}
              placeholder={formatMessage({ id: 'ui-inn-reach.settings.agency-to-folio-locations.placeholder.folio-library' })}
              onChange={handleChangeLocalServerLibrary}
            />
            <Field
              id={LOCAL_SERVER_LOCATION_ID}
              data-testid={LOCAL_SERVER_LOCATION_ID}
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
      libraryId: PropTypes.string,
      locationId: PropTypes.string,
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
  localServerLocationOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
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
  serverLocationOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  serverOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  values: PropTypes.object.isRequired,
  onChangeFormResetState: PropTypes.func.isRequired,
  onChangeLocalServer: PropTypes.func.isRequired,
  onChangeLocalServerLocationOptions: PropTypes.func.isRequired,
  onChangePristineState: PropTypes.func.isRequired,
  onChangeServer: PropTypes.func.isRequired,
  onChangeServerLocationOptions: PropTypes.func.isRequired,
  folioLocationsMap: PropTypes.object,
};

export default stripesFinalForm({
  subscription: {
    values: true,
  },
})(AgencyToFolioLocationsForm);
