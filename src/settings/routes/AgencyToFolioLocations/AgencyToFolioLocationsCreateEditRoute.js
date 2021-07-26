import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  isEmpty,
} from 'lodash';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import {
  ConfirmationModal,
  LoadingPane,
} from '@folio/stripes-components';
import { FormattedMessage, useIntl } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import { AgencyToFolioLocationsForm } from '../../components/AgencyToFolioLocations';
import {
  useCallout,
} from '../../../hooks';
import {
  CALLOUT_ERROR_TYPE,
  AGENCY_TO_FOLIO_LOCATIONS_FIELDS,
} from '../../../constants';
import {
  getFolioLocationOptions,
} from '../../components/AgencyToFolioLocations/AgencyToFolioLocationsForm/utils';
import {
  getFolioLibraryOptions,
  getFolioLocationsMap,
  getLocalInitialValues,
  getLeftColumn,
  getLocalServerData,
  getLocalServers,
  getServerOptions,
} from './utils';

const {
  LIBRARY_ID,
  LOCATION_ID,
  LOCAL_CODE,
  AGENCY_CODE_MAPPINGS,
} = AGENCY_TO_FOLIO_LOCATIONS_FIELDS;

const AgencyToFolioLocationsCreateEditRoute = ({
  resources: {
    centralServerRecords: {
      records: centralServers,
      isPending: isServersPending,
      hasLoaded: hasLoadedServers,
    },
    institutions: {
      records: institutionsData,
      isPending: isInstitutionsPending,
      hasLoaded: hasLoadedInstitutions,
    },
    campuses: {
      records: campusesData,
      isPending: isCampusesPending,
      hasLoaded: hasLoadedCampuses,
    },
    folioLibraries: {
      records: libraries,
      isPending: isFolioLibrariesPending,
    },
    folioLocations: {
      records: locations,
      isPending: isFolioLocationsPending,
    },
  },
  history,
  mutator,
}) => {
  const servers = centralServers[0]?.centralServers || [];
  const folioLibraries = libraries[0]?.loclibs || [];
  const campuses = campusesData[0]?.loccamps || [];
  const institutions = institutionsData[0]?.locinsts || [];

  const { formatMessage } = useIntl();
  const showCallout = useCallout();
  const unblockRef = useRef();

  const [selectedServer, setSelectedServer] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [isPristine, setIsPristine] = useState(true);
  const [isResetForm, setIsResetForm] = useState(false);
  const [localServers, setLocalServers] = useState({});
  const [isLocalServersPending, setIsLocalServersPending] = useState(false);
  const [agencyMappings, setAgencyMappings] = useState({});
  const [initialValues, setInitialValues] = useState({});
  const [libraryOptions, setLibraryOptions] = useState([]);
  const [folioLocationsMap, setFolioLocationsMap] = useState(null);
  const [nextLocation, setNextLocation] = useState(null);
  const [serverLocationOptions, setServerLocationOptions] = useState([]);
  const [localServerLocationOptions, setLocalServerLocationOptions] = useState([]);

  const serverOptions = useMemo(() => getServerOptions(servers), [servers]);

  const fetchAgencyMappings = () => {
    mutator.agencyMappings.GET()
      .then(response => setAgencyMappings(response))
      .catch(() => null);
  };

  const fetchLocalServers = () => {
    setIsLocalServersPending(true);

    mutator.localServers.GET()
      .then(response => setLocalServers(response))
      .catch(() => null)
      .finally(() => setIsLocalServersPending(false));
  };

  const resetData = () => {
    setInitialValues({});
    setAgencyMappings({});
    setIsResetForm(true);
  };

  const resetCentralServer = () => {
    setSelectedServer({});
    mutator.selectedServerId.replace('');
  };

  const changePristineState = (value) => {
    setIsPristine(value);
  };

  const changeFormResetState = (value) => {
    setIsResetForm(value);
  };

  const changeServerLocationOptions = (locOptions) => {
    setServerLocationOptions(locOptions);
  };

  const changeLocalServerLocationOptions = (locOptions) => {
    setLocalServerLocationOptions(locOptions);
  };

  const changeServer = (selectedServerId) => {
    if (selectedServerId === selectedServer.id) return;

    const optedServer = servers.find(server => server.id === selectedServerId);
    const libOptions = getFolioLibraryOptions(folioLibraries, campuses, institutions);

    setSelectedServer(optedServer);
    mutator.selectedServerId.replace(optedServer.id);
    resetData();
    fetchAgencyMappings();
    fetchLocalServers();
    setLibraryOptions(libOptions);
  };

  const addLocalInitialValues = (localCode, libraryId, locationId, isNoValueOption) => {
    const { localServerList } = localServers;
    let locServerData;

    if (!isNoValueOption) {
      locServerData = getLocalServerData(agencyMappings, localCode);
    }

    if (isNoValueOption) {
      setInitialValues({
        libraryId,
        locationId,
      });
    } else if (locServerData) {
      const {
        localCode: localCodeValue,
        localServerLibraryId,
        localServerLocationId,
        agencyCodeMappings,
      } = getLocalInitialValues(localServerList, agencyMappings, locServerData);

      if (localServerLibraryId) {
        const locOptions = getFolioLocationOptions(folioLocationsMap, localServerLibraryId);

        setLocalServerLocationOptions(locOptions);
      }

      setInitialValues({
        libraryId,
        locationId,
        localCode: localCodeValue,
        localServerLibraryId,
        localServerLocationId,
        agencyCodeMappings,
      });
    } else {
      setInitialValues({
        libraryId,
        locationId,
        localCode,
        [AGENCY_CODE_MAPPINGS]: getLeftColumn(localServerList, localCode),
      });
    }
  };

  const continueNavigation = () => {
    unblockRef.current();
    setNextLocation(null);
    history.push(nextLocation.pathname);
  };

  const handleModalCancel = () => {
    resetData();
    resetCentralServer();
    setOpenModal(false);

    if (nextLocation) continueNavigation();
  };

  const handleModalConfirm = () => {
    setNextLocation(null);
    setOpenModal(false);
  };

  const handleSubmit = (record) => {
    const finalRecord = {
      [LIBRARY_ID]: record[LIBRARY_ID],
      [LOCATION_ID]: record[LOCATION_ID],
    };

    if (record[LOCAL_CODE]) {
      finalRecord.localServers = getLocalServers(record, agencyMappings);
    } else if (agencyMappings.localServers) {
      finalRecord.localServers = agencyMappings.localServers;
    }

    mutator.agencyMappings.PUT(finalRecord)
      .then(() => {
        const action = isEmpty(agencyMappings) ? 'create' : 'update';

        setAgencyMappings(finalRecord);
        showCallout({
          message: <FormattedMessage
            id={`ui-inn-reach.settings.agency-to-folio-locations.${action}.success`}
            values={{ name: selectedServer.name }}
          />,
        });
      })
      .catch(error => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage
            id="ui-inn-reach.settings.agency-to-folio-locations.callout.connection-problem.put"
            values={JSON.parse(error.message)}
          />,
        });
      });
  };

  useEffect(() => {
    if (!isEmpty(agencyMappings)) {
      const { localCode } = initialValues;
      const {
        libraryId,
        locationId,
      } = agencyMappings;

      if (localCode) {
        addLocalInitialValues(localCode, libraryId, locationId);
      } else {
        const locOptions = getFolioLocationOptions(folioLocationsMap, libraryId);

        setServerLocationOptions(locOptions);

        setInitialValues({
          libraryId,
          locationId,
        });
      }
    }
  }, [agencyMappings]);

  useEffect(() => {
    if (!isEmpty(locations)) {
      const folioLocations = locations[0]?.locations;
      const locationsMap = getFolioLocationsMap(folioLocations);

      setFolioLocationsMap(locationsMap);
    }
  }, [locations]);

  useEffect(() => {
    unblockRef.current = history.block(nextLocat => {
      if (isPristine) {
        resetCentralServer();
        resetData();
      } else {
        setOpenModal(true);
        setNextLocation(nextLocat);
      }

      return isPristine;
    });

    return () => unblockRef.current();
  }, [isPristine]);

  if (
    (isServersPending && !hasLoadedServers) ||
    (isInstitutionsPending && !hasLoadedInstitutions) ||
    (isCampusesPending && !hasLoadedCampuses) ||
    isFolioLibrariesPending ||
    isFolioLocationsPending
  ) {
    return <LoadingPane />;
  }

  return (
    <>
      <AgencyToFolioLocationsForm
        selectedServer={selectedServer}
        serverOptions={serverOptions}
        isLocalServersPending={isLocalServersPending}
        libraryOptions={libraryOptions}
        localServers={localServers}
        folioLocationsMap={folioLocationsMap}
        agencyMappings={agencyMappings}
        formatMessage={formatMessage}
        initialValues={initialValues}
        isResetForm={isResetForm}
        serverLocationOptions={serverLocationOptions}
        localServerLocationOptions={localServerLocationOptions}
        onSubmit={handleSubmit}
        onChangeServer={changeServer}
        onChangeLocalServer={addLocalInitialValues}
        onChangePristineState={changePristineState}
        onChangeFormResetState={changeFormResetState}
        onChangeServerLocationOptions={changeServerLocationOptions}
        onChangeLocalServerLocationOptions={changeLocalServerLocationOptions}
      />
      <ConfirmationModal
        id="cancel-editing-confirmation"
        open={openModal}
        heading={<FormattedMessage id="ui-inn-reach.settings.folio-to-inn-reach-locations.create-edit.modal-heading.areYouSure" />}
        message={<FormattedMessage id="ui-inn-reach.settings.folio-to-inn-reach-locations.create-edit.modal-message.unsavedChanges" />}
        confirmLabel={<FormattedMessage id="ui-inn-reach.settings.folio-to-inn-reach-locations.create-edit.modal-confirmLabel.keepEditing" />}
        cancelLabel={<FormattedMessage id="ui-inn-reach.settings.folio-to-inn-reach-locations.create-edit.modal-cancelLabel.closeWithoutSaving" />}
        onCancel={handleModalCancel}
        onConfirm={handleModalConfirm}
      />
    </>
  );
};

AgencyToFolioLocationsCreateEditRoute.manifest = Object.freeze({
  selectedServerId: { initialValue: '' },
  centralServerRecords: {
    type: 'okapi',
    path: 'inn-reach/central-servers?limit=1000',
    throwErrors: false,
  },
  institutions: {
    type: 'okapi',
    path: 'location-units/institutions?limit=1000&query=cql.allRecords%3D1%20sortby%20name',
    throwErrors: false,
  },
  campuses: {
    type: 'okapi',
    path: 'location-units/campuses?limit=1000&query=cql.allRecords%3D1%20sortby%20name',
    throwErrors: false,
  },
  folioLibraries: {
    type: 'okapi',
    path: 'location-units/libraries?query=cql.allRecords=1%20sortby%20name&limit=2000',
    throwErrors: false,
  },
  folioLocations: {
    type: 'okapi',
    path: 'locations?limit=1000&query=cql.allRecords%3D1%20sortby%20name',
    throwErrors: false,
  },
  agencyMappings: {
    type: 'okapi',
    path: 'inn-reach/central-servers/%{selectedServerId}/agency-mappings',
    accumulate: true,
    fetch: false,
    throwErrors: false,
  },
  localServers: {
    type: 'okapi',
    path: 'inn-reach/central-servers/%{selectedServerId}/d2r/contribution/localservers',
    accumulate: true,
    fetch: false,
    throwErrors: false,
  },
});

AgencyToFolioLocationsCreateEditRoute.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  resources: PropTypes.shape({
    selectedServerId: PropTypes.string,
    centralServerRecords: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
      isPending: PropTypes.bool.isRequired,
      hasLoaded: PropTypes.bool.isRequired,
    }).isRequired,
    institutions: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
      isPending: PropTypes.bool.isRequired,
      hasLoaded: PropTypes.bool.isRequired,
    }).isRequired,
    campuses: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
      isPending: PropTypes.bool.isRequired,
      hasLoaded: PropTypes.bool.isRequired,
    }).isRequired,
    folioLibraries: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
      isPending: PropTypes.bool.isRequired,
    }).isRequired,
    folioLocations: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
      isPending: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    selectedServerId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    agencyMappings: PropTypes.shape({
      GET: PropTypes.func,
      PUT: PropTypes.func,
    }).isRequired,
    localServers: PropTypes.shape({
      GET: PropTypes.func,
    }).isRequired,
  }),
};

export default stripesConnect(AgencyToFolioLocationsCreateEditRoute);
