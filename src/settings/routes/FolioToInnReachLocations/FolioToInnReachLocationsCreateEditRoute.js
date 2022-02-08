import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  isEmpty,
} from 'lodash';
import PropTypes from 'prop-types';
import {
  LoadingPane,
} from '@folio/stripes-components';
import { FormattedMessage, useIntl } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import FolioToInnReachLocationsForm from '../../components/FolioToInnReachLocations/FolioToInnReachLocationsForm';
import {
  useCallout,
} from '../../../hooks';
import {
  CALLOUT_ERROR_TYPE,
  CENTRAL_SERVER_CONFIGURATION_FIELDS,
  CENTRAL_SERVERS_LIMITING,
  FOLIO_TO_INN_REACH_LOCATION_FIELDS,
  LOCAL_AGENCIES_FIELDS,
  NO_VALUE_LIBRARY_OPTION,
  NO_VALUE_OPTION_VALUE,
} from '../../../constants';
import {
  getInnReachLocationsMapCodeFirst,
  getLeftColumnLibraries,
  getLeftColumnLocations,
  getLibrariesTabularList,
  getServerLibraries,
  getFinalLocationMappings,
  getLocationMappingsMap,
  getTabularListForLocations,
  getTabularListMap,
  getFinalLibraryMappings,
  getLibrariesMappingsMap,
} from './utils';
import {
  getCentralServerOptions,
} from '../../../utils';

const {
  LIBRARIES_TABULAR_LIST,
  LOCATIONS_TABULAR_LIST,
} = FOLIO_TO_INN_REACH_LOCATION_FIELDS;

const {
  LOCAL_AGENCIES,
} = CENTRAL_SERVER_CONFIGURATION_FIELDS;

const {
  FOLIO_LIBRARY_IDS,
} = LOCAL_AGENCIES_FIELDS;

const FolioToInnReachLocationsCreateEditRoute = ({
  resources: {
    selectedLibraryId,
    centralServerRecords: {
      records: centralServers,
      isPending: isServersPending,
      hasLoaded: hasLoadedServers,
    },
    innReachLocations: {
      records: innReachLoc,
      isPending: isInnReachLocPending,
      hasLoaded: hasLoadedInnReachLoc,
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
  mutator,
}) => {
  const servers = centralServers[0]?.centralServers || [];
  const innReachLocations = innReachLoc[0]?.locations || [];
  const folioLocations = locations[0]?.locations || [];
  const folioLibraries = libraries[0]?.loclibs || [];

  const { formatMessage } = useIntl();
  const showCallout = useCallout();

  const [selectedServer, setSelectedServer] = useState({});
  const [isResetForm, setIsResetForm] = useState(false);
  const [mappingType, setMappingType] = useState('');
  const [librarySelection, setLibrarySelection] = useState('');
  const [initialValues, setInitialValues] = useState({});
  const [serverLibraries, setServerLibraries] = useState([]);
  const [serverLibraryOptions, setServerLibraryOptions] = useState([]);
  const [libraryMappings, setLibraryMappings] = useState([]);
  const [locationMappings, setLocationMappings] = useState([]);
  const [isMappingsPending, setIsMappingsPending] = useState(false);

  const serverOptions = useMemo(() => getCentralServerOptions(servers), [servers]);
  const librariesMappingType = formatMessage({ id: 'ui-inn-reach.settings.folio-to-inn-reach-locations.field-value.libraries' });
  const locationsMappingType = formatMessage({ id: 'ui-inn-reach.settings.folio-to-inn-reach-locations.field-value.locations' });
  const mappingTypePlaceholder = formatMessage({ id: 'ui-inn-reach.settings.folio-to-inn-reach-locations.placeholder.select-type-to-map' });
  const mappingTypesOptions = [
    {
      id: '1',
      value: mappingTypePlaceholder,
      label: mappingTypePlaceholder,
    },
    {
      id: '2',
      value: librariesMappingType,
      label: librariesMappingType,
    },
    {
      id: '3',
      value: locationsMappingType,
      label: locationsMappingType,
    },
  ];

  const isShowTabularList = (
    !isEmpty(selectedServer) &&
    !isMappingsPending &&
    ((mappingType === locationsMappingType && !!selectedLibraryId) || mappingType === librariesMappingType)
  );

  const changeFormResetState = (value) => {
    setIsResetForm(value);
  };

  const resetLibraryStates = () => {
    setLibrarySelection('');
    mutator.selectedLibraryId.replace('');
  };

  const resetCentralServer = () => {
    setSelectedServer({});
    mutator.selectedServerId.replace('');
  };

  const resetData = () => {
    setInitialValues({});
    setLocationMappings([]);
    setLibraryMappings([]);
    setIsResetForm(true);
  };

  const reset = () => {
    setServerLibraries([]);
    setServerLibraryOptions([]);
    resetCentralServer();
    resetData();
    setMappingType('');
    resetLibraryStates();
  };

  const fetchLibraryMappings = () => {
    mutator.libraryMappings.GET()
      .then(response => setLibraryMappings(response.libraryMappings))
      .catch(() => setLibraryMappings([]))
      .finally(() => setIsMappingsPending(false));
  };

  const fetchLocationMappings = () => {
    mutator.locationMappings.GET()
      .then(response => setLocationMappings(response.locationMappings))
      .catch(() => setLocationMappings([]))
      .finally(() => setIsMappingsPending(false));
  };

  const handleServerChange = (selectedServerName) => {
    if (selectedServerName === selectedServer.name) return;

    const optedServer = servers.find(server => server.name === selectedServerName);
    const formattedLibraries = getServerLibraries(optedServer.localAgencies, folioLibraries);

    reset();
    setSelectedServer(optedServer);
    mutator.selectedServerId.replace(optedServer.id);
    setServerLibraries(formattedLibraries);
    setServerLibraryOptions([NO_VALUE_LIBRARY_OPTION, ...formattedLibraries]);
  };

  const changeMappingType = (selectedMappingType) => {
    if (selectedMappingType === mappingType) return;

    setInitialValues({});
    resetLibraryStates();
    setMappingType(selectedMappingType);

    if (selectedMappingType === librariesMappingType) {
      setIsMappingsPending(true);
      fetchLibraryMappings();
    }
  };

  const handleChangeLibrary = (libraryName) => {
    if (libraryName === librarySelection) return;

    const isNoValueOption = libraryName === NO_VALUE_OPTION_VALUE;
    const libraryId = serverLibraryOptions.find(library => library.value === libraryName)?.id;

    setLibrarySelection(libraryName);
    mutator.selectedLibraryId.replace(libraryId);

    if (!isNoValueOption) {
      setInitialValues({});
      setIsMappingsPending(true);
      fetchLocationMappings();
    }
  };

  const handleSubmit = (record) => {
    let finalRecord;

    if (selectedLibraryId) {
      finalRecord = {
        locationMappings: getFinalLocationMappings({
          folioLocations,
          tabularListMap: getTabularListMap(record),
          innReachLocationsMap: getInnReachLocationsMapCodeFirst(innReachLocations),
          locationMappingsMap: getLocationMappingsMap(locationMappings),
        }),
      };

      mutator.locationMappings.PUT(finalRecord)
        .then(() => {
          const action = isEmpty(locationMappings) ? 'create' : 'update';

          setLocationMappings(finalRecord.locationMappings);
          showCallout({ message: <FormattedMessage id={`ui-inn-reach.settings.folio-to-inn-reach-locations.create-edit.${action}.success`} /> });
        })
        .catch(() => {
          const action = isEmpty(locationMappings) ? 'post' : 'put';

          showCallout({
            type: CALLOUT_ERROR_TYPE,
            message: <FormattedMessage id={`ui-inn-reach.settings.folio-to-inn-reach-locations.create-edit.connectionProblem.${action}`} />,
          });
        });
    } else {
      finalRecord = {
        libraryMappings: getFinalLibraryMappings({
          folioLibraries,
          tabularListMap: getTabularListMap(record),
          innReachLocationsMap: getInnReachLocationsMapCodeFirst(innReachLocations),
          librariesMappingsMap: getLibrariesMappingsMap(libraryMappings),
        }),
      };

      mutator.libraryMappings.PUT(finalRecord)
        .then(() => {
          const action = isEmpty(libraryMappings) ? 'create' : 'update';

          setLibraryMappings(finalRecord.libraryMappings);
          showCallout({ message: <FormattedMessage id={`ui-inn-reach.settings.folio-to-inn-reach-locations.create-edit.${action}.success`} /> });
        })
        .catch(() => {
          const action = isEmpty(libraryMappings) ? 'post' : 'put';

          showCallout({
            type: CALLOUT_ERROR_TYPE,
            message: <FormattedMessage id={`ui-inn-reach.settings.folio-to-inn-reach-locations.create-edit.connectionProblem.${action}`} />,
          });
        });
    }
  };

  useEffect(() => {
    if (!isMappingsPending && mappingType === librariesMappingType) {
      if (isEmpty(libraryMappings)) {
        const librariesInitialValues = selectedServer[LOCAL_AGENCIES].reduce((accum, localAgency, index) => {
          accum[`${LIBRARIES_TABULAR_LIST}${index}`] = getLeftColumnLibraries(serverLibraries, localAgency[FOLIO_LIBRARY_IDS]);

          return accum;
        }, {});

        setInitialValues(librariesInitialValues);
      } else {
        const librariesInitialValues = selectedServer[LOCAL_AGENCIES].reduce((accum, localAgency, index) => {
          accum[`${LIBRARIES_TABULAR_LIST}${index}`] = getLibrariesTabularList({
            libMappingsMap: getLibrariesMappingsMap(libraryMappings),
            serverLibraries,
            innReachLocations,
            folioLibraryIds: localAgency[FOLIO_LIBRARY_IDS],
          });

          return accum;
        }, {});

        setInitialValues(librariesInitialValues);
      }
    }
  }, [libraryMappings, isMappingsPending, selectedServer]);

  useEffect(() => {
    if (!isMappingsPending && mappingType === locationsMappingType) {
      if (isEmpty(locationMappings)) {
        setInitialValues({
          [LOCATIONS_TABULAR_LIST]: getLeftColumnLocations({
            selectedLibraryId,
            folioLocations,
            folioLibraries,
          }),
        });
      } else {
        setInitialValues({
          [LOCATIONS_TABULAR_LIST]: getTabularListForLocations({
            locMappingsMap: getLocationMappingsMap(locationMappings),
            selectedLibraryId,
            folioLocations,
            innReachLocations,
            folioLibraries,
          }),
        });
      }
    }
  }, [locationMappings, isMappingsPending]);

  if (
    (isServersPending && !hasLoadedServers) ||
    (isInnReachLocPending && !hasLoadedInnReachLoc) ||
    isFolioLibrariesPending ||
    isFolioLocationsPending
  ) {
    return <LoadingPane />;
  }

  return (
    <FolioToInnReachLocationsForm
      selectedServer={selectedServer}
      mappingType={mappingType}
      serverLibraryOptions={serverLibraryOptions}
      innReachLocations={innReachLocations}
      serverOptions={serverOptions}
      isMappingsPending={isMappingsPending}
      isShowTabularList={isShowTabularList}
      mappingTypesOptions={mappingTypesOptions}
      formatMessage={formatMessage}
      librariesMappingType={librariesMappingType}
      locationsMappingType={locationsMappingType}
      initialValues={initialValues}
      isResetForm={isResetForm}
      onSubmit={handleSubmit}
      onChangeFormResetState={changeFormResetState}
      onChangeServer={handleServerChange}
      onChangeMappingType={changeMappingType}
      onChangeLibrary={handleChangeLibrary}
    />
  );
};

FolioToInnReachLocationsCreateEditRoute.manifest = Object.freeze({
  selectedServerId: { initialValue: '' },
  selectedLibraryId: { initialValue: '' },
  centralServerRecords: {
    type: 'okapi',
    path: `inn-reach/central-servers?limit=${CENTRAL_SERVERS_LIMITING}`,
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
  innReachLocations: {
    type: 'okapi',
    path: 'inn-reach/locations',
    throwErrors: false,
  },
  libraryMappings: {
    type: 'okapi',
    path: 'inn-reach/central-servers/%{selectedServerId}/libraries/location-mappings',
    accumulate: true,
    fetch: false,
    throwErrors: false,
  },
  locationMappings: {
    type: 'okapi',
    path: 'inn-reach/central-servers/%{selectedServerId}/libraries/%{selectedLibraryId}/locations/location-mappings',
    accumulate: true,
    fetch: false,
    throwErrors: false,
  },
});

FolioToInnReachLocationsCreateEditRoute.propTypes = {
  resources: PropTypes.shape({
    selectedServerId: PropTypes.string,
    selectedLibraryId: PropTypes.string,
    centralServerRecords: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
      isPending: PropTypes.bool.isRequired,
      failed: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
      hasLoaded: PropTypes.bool.isRequired,
    }).isRequired,
    folioLibraries: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
      isPending: PropTypes.bool.isRequired,
      failed: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    }).isRequired,
    folioLocations: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
      isPending: PropTypes.bool.isRequired,
      failed: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    }).isRequired,
    innReachLocations: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
      isPending: PropTypes.bool.isRequired,
      failed: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
      hasLoaded: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    selectedServerId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    selectedLibraryId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    libraryMappings: PropTypes.shape({
      GET: PropTypes.func,
      PUT: PropTypes.func,
    }).isRequired,
    locationMappings: PropTypes.shape({
      GET: PropTypes.func,
      PUT: PropTypes.func,
    }).isRequired,
  }),
};

export default stripesConnect(FolioToInnReachLocationsCreateEditRoute);
