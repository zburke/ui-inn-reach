import React, {
  useEffect,
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
import FolioToInnReachLocationsForm from '../../components/FolioToInnReachLocations/FolioToInnReachLocationsForm';
import {
  useCallout,
} from '../../../hooks';
import {
  CALLOUT_ERROR_TYPE,
  FOLIO_TO_INN_REACH_LOCATIONS,
} from '../../../constants';
import {
  getInnReachLocationsMapCodeFirst,
  getLeftColumnLibraries,
  getLeftColumnLocations,
  getLibrariesTabularList,
  getLibraryOptions,
  getFinalLocationMappings,
  getLocationMappingsMap,
  getTabularListForLocations,
  getTabularListMapForLocations,
  getFinalLibraryMappings,
  getTabularListMapForLibraries,
  getLibrariesMappingsMap,
} from './utils';

const {
  TABULAR_LIST,
  LIBRARY,
  CENTRAL_SERVER,
} = FOLIO_TO_INN_REACH_LOCATIONS;

const FolioToInnReachLocationsCreateEditRoute = ({
  resources: {
    selectedLibraryId,
    centralServerRecords: {
      records: centralServers,
      isPending: isServersPending,
    },
    innReachLocations: {
      records: innReachLoc,
      isPending: isInnReachLocPending,
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
  const innReachLocations = innReachLoc[0]?.locations || [];
  const folioLocations = locations[0]?.locations || [];
  const folioLibraries = libraries[0]?.loclibs || [];

  const { formatMessage } = useIntl();
  const showCallout = useCallout();
  const unblockRef = useRef();

  // central server states
  const [selectedServer, setSelectedServer] = useState({});
  const [isPristine, setIsPristine] = useState(true);
  const [prevServerName, setPrevServerName] = useState('');
  const [nextServer, setNextServer] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [nextLocation, setNextLocation] = useState(null);
  const [isResetForm, setIsResetForm] = useState(false);

  // mapping type states
  const [mappingType, setMappingType] = useState('');
  const [nextMappingType, setNextMappingType] = useState('');
  const [prevMappingType, setPrevMappingType] = useState('');

  // library states
  const [librarySelection, setLibrarySelection] = useState('');
  const [nextLibrarySelection, setNextLibrarySelection] = useState('');
  const [prevLibrarySelection, setPrevLibrarySelection] = useState('');

  // common states
  const [initialValues, setInitialValues] = useState({});
  const [serverLibrariesOptions, setServerLibrariesOptions] = useState([]);

  // mappings states
  const [libraryMappings, setLibraryMappings] = useState({});
  const [locationMappings, setLocationMappings] = useState({});
  const [isMappingsPending, setIsMappingsPending] = useState(false);
  const [locationMappingsMap, setLocationMappingsMap] = useState(null);
  const [librariesMappingsMap, setLibrariesMappingsMap] = useState(null);

  const serverOptions = servers.map(({ id, name }) => ({
    id,
    value: name,
    label: name,
  }));

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

  const changePristineState = (value) => {
    setIsPristine(value);
  };

  const changeFormResetState = (value) => {
    setIsResetForm(value);
  };

  const resetMappingTypeStates = () => {
    setMappingType('');
    setNextMappingType('');
    setPrevMappingType('');
  };

  const resetLibraryStates = () => {
    setLibrarySelection('');
    setNextLibrarySelection('');
    setPrevLibrarySelection('');
    mutator.selectedLibraryId.replace('');
  };

  const fetchLibraryMappings = () => {
    setIsMappingsPending(true);

    mutator.libraryMappings.GET()
      .then(response => setLibraryMappings(response))
      .catch(() => null)
      .finally(() => setIsMappingsPending(false));
  };

  const fetchLocationMappings = () => {
    setIsMappingsPending(true);

    mutator.locationMappings.GET()
      .then(response => setLocationMappings(response))
      .catch(() => null)
      .finally(() => setIsMappingsPending(false));
  };

  const handleServerChange = (selectedServerName) => {
    const optedServer = servers.find(server => server.name === selectedServerName);
    const isNewServerSelected = selectedServerName !== selectedServer.name;

    if (isNewServerSelected) {
      if (mappingType) {
        setOpenModal(true);
        setNextServer(optedServer);
      } else {
        setSelectedServer(optedServer);
      }

      setPrevServerName(selectedServer.name);
    }
  };

  const changeMappingType = (selectedMappingType) => {
    if (selectedMappingType === mappingType) return;

    // if it is the first selection or not the first, but the library is not selected and the tabular list is pristine
    if (!mappingType || (mappingType && !librarySelection && isPristine)) {
      setMappingType(selectedMappingType);

      if (selectedMappingType === librariesMappingType) {
        setInitialValues({});
        fetchLibraryMappings();
      }
    } else { // if we have the selected library or the tabular list option
      setOpenModal(true);
      setNextMappingType(selectedMappingType);
    }

    setPrevMappingType(mappingType);
  };

  const handleChangeLibrary = (selectedLibraryName) => {
    if (selectedLibraryName === librarySelection) return;

    // if it is the first selection or not the first, but the tabular list is pristine
    if (!librarySelection || (librarySelection && isPristine)) {
      const libraryId = serverLibrariesOptions.find(library => library.value === selectedLibraryName)?.id;

      setLibrarySelection(selectedLibraryName);
      mutator.selectedLibraryId.replace(libraryId);
      setInitialValues({});
      fetchLocationMappings();
    } else {
      setOpenModal(true);
      setNextLibrarySelection(selectedLibraryName);
    }

    setPrevLibrarySelection(librarySelection);
    setPrevMappingType('');
  };

  const handleSubmit = (record) => {
    let finalRecord;

    if (selectedLibraryId) {
      finalRecord = {
        locationMappings: getFinalLocationMappings({
          folioLocations,
          tabularListMap: getTabularListMapForLocations(record.tabularList),
          innReachLocationsMap: getInnReachLocationsMapCodeFirst(innReachLocations),
          locationMappingsMap,
        }),
      };

      mutator.locationMappings.PUT(finalRecord)
        .then(() => {
          const action = isEmpty(locationMappings) ? 'create' : 'update';

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
          tabularListMap: getTabularListMapForLibraries(record.tabularList),
          innReachLocationsMap: getInnReachLocationsMapCodeFirst(innReachLocations),
          librariesMappingsMap,
        }),
      };

      mutator.libraryMappings.PUT(finalRecord)
        .then(() => {
          const action = isEmpty(libraryMappings) ? 'create' : 'update';

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

  const continueNavigation = () => {
    unblockRef.current();
    setNextLocation(null);
    history.push(nextLocation.pathname);
  };

  const handleModalCancel = () => {
    if (prevServerName) { // if a new central server was selected
      setPrevServerName('');
      resetMappingTypeStates();
      resetLibraryStates();
      setSelectedServer(nextServer);
    } else if (prevMappingType) { // if a new mapping type was selected
      resetLibraryStates();
      setPrevMappingType('');
      setMappingType(nextMappingType);

      if (nextMappingType === librariesMappingType) {
        setInitialValues({});
        fetchLibraryMappings();
      }
    } else if (prevLibrarySelection) { // if a new library was selected
      const libraryId = serverLibrariesOptions.find(library => library.value === nextLibrarySelection)?.id;

      setLibrarySelection(nextLibrarySelection);
      mutator.selectedLibraryId.replace(libraryId);
      setInitialValues({});
      fetchLocationMappings();
      setPrevLibrarySelection('');
    } else { // otherwise, the navigation to the current page or leave from the page was pressed
      setSelectedServer({});
    }

    setOpenModal(false);
    setIsResetForm(true);
    if (nextLocation) continueNavigation();
  };

  const backPrevServer = () => {
    const index = servers.findIndex(server => server.name === prevServerName);
    const prevOption = document.getElementById(`option-${CENTRAL_SERVER}-${index}-${prevServerName}`);

    if (prevOption) prevOption.click();
  };

  const backPrevLibrary = () => {
    const index = serverLibrariesOptions.findIndex(lib => lib.value === prevLibrarySelection);
    const prevOption = document.getElementById(`option-${LIBRARY}-${index}-${prevLibrarySelection}`);

    if (prevOption) prevOption.click();
  };

  const handleModalConfirm = () => {
    if (prevServerName) { // if a new central server was selected
      backPrevServer();
      setPrevServerName('');
    } else if (prevMappingType) {
      setPrevMappingType('');
    } else if (prevLibrarySelection) {
      backPrevLibrary();
      setPrevLibrarySelection('');
    }

    setNextLocation(null);
    setOpenModal(false);
  };

  useEffect(() => {
    if (!isMappingsPending && mappingType === librariesMappingType) {
      if (isEmpty(libraryMappings)) {
        setInitialValues({
          [TABULAR_LIST]: getLeftColumnLibraries(serverLibrariesOptions),
        });
      } else {
        const libMappings = libraryMappings[0].libraryMappings;
        const libMappingsMap = getLibrariesMappingsMap(libMappings);

        setLibrariesMappingsMap(libMappingsMap);

        setInitialValues({
          [TABULAR_LIST]: getLibrariesTabularList({
            libMappingsMap,
            serverLibrariesOptions,
            innReachLocations,
          }),
        });
      }
    }
  }, [libraryMappings, isMappingsPending]);

  useEffect(() => {
    if (!isMappingsPending && mappingType === locationsMappingType) {
      if (isEmpty(locationMappings)) {
        setInitialValues({
          [TABULAR_LIST]: getLeftColumnLocations({
            selectedLibraryId,
            folioLocations,
            folioLibraries,
          }),
        });
      } else {
        const locMappings = locationMappings[0].locationMappings;
        const locMappingsMap = getLocationMappingsMap(locMappings);

        setLocationMappingsMap(locMappingsMap);

        setInitialValues({
          [TABULAR_LIST]: getTabularListForLocations({
            locMappingsMap,
            selectedLibraryId,
            folioLocations,
            innReachLocations,
            folioLibraries,
          }),
        });
      }
    }
  }, [locationMappings, isMappingsPending]);

  useEffect(() => {
    if (isEmpty(selectedServer)) {
      setServerLibrariesOptions([]);
      mutator.selectedServerId.replace('');
      resetMappingTypeStates();
      resetLibraryStates();
    } else {
      const libraryOptions = getLibraryOptions({
        localAgencies: selectedServer.localAgencies,
        folioLibraries,
      });

      mutator.selectedServerId.replace(selectedServer.id);
      setServerLibrariesOptions(libraryOptions);
    }
  }, [selectedServer]);

  useEffect(() => {
    unblockRef.current = history.block(nextLocat => {
      const shouldNavigate = !mappingType && !librarySelection && isPristine;

      if (shouldNavigate) { // if we navigate somewhere with empty fields
        setSelectedServer({});
      } else { // if we navigate somewhere and at least one field is filled
        setOpenModal(true);
        setNextLocation(nextLocat);
      }

      return shouldNavigate;
    });

    return () => unblockRef.current();
  }, [mappingType, librarySelection, isPristine]);

  if (
    isServersPending ||
    isInnReachLocPending ||
    isFolioLibrariesPending ||
    isFolioLocationsPending
  ) {
    return <LoadingPane />;
  }

  return (
    <>
      <FolioToInnReachLocationsForm
        selectedServer={selectedServer}
        mappingType={mappingType}
        serverLibrariesOptions={serverLibrariesOptions}
        innReachLocations={innReachLocations}
        isPristine={isPristine}
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
        onChangePristineState={changePristineState}
        onChangeFormResetState={changeFormResetState}
        onChangeServer={handleServerChange}
        onChangeMappingType={changeMappingType}
        onChangeLibrary={handleChangeLibrary}
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

FolioToInnReachLocationsCreateEditRoute.manifest = Object.freeze({
  selectedServerId: { initialValue: '' },
  selectedLibraryId: { initialValue: '' },
  centralServerRecords: {
    type: 'okapi',
    path: 'inn-reach/central-servers',
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
    path: 'inn-reach/central-servers/%{selectedServerId}/libraries/loc-mappings',
    accumulate: true,
    fetch: false,
    throwErrors: false,
  },
  locationMappings: {
    type: 'okapi',
    path: 'inn-reach/central-servers/%{selectedServerId}/libraries/%{selectedLibraryId}/locations/loc-mappings',
    accumulate: true,
    fetch: false,
    throwErrors: false,
  },
});

FolioToInnReachLocationsCreateEditRoute.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  resources: PropTypes.shape({
    selectedServerId: PropTypes.string,
    selectedLibraryId: PropTypes.string,
    centralServerRecords: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
      isPending: PropTypes.bool.isRequired,
      failed: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
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
