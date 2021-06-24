import React, {
  useEffect,
  useState,
} from 'react';
import { isEmpty } from 'lodash';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import { ConfirmationModal, LoadingPane } from '@folio/stripes-components';
import { FormattedMessage, useIntl } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import FolioToInnReachLocationsForm from '../../components/FolioToInnReachLocations';
import { useCallout, useCentralServers } from '../../../hooks';
import { CALLOUT_ERROR_TYPE, FOLIO_TO_INN_REACH_LOCATIONS } from '../../../constants';
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
} = FOLIO_TO_INN_REACH_LOCATIONS;

const FolioToInnReachLocationsCreateEditRoute = ({
  resources: {
    selectedLibraryId,
    centralServerRecords: {
      records: servers,
      isPending: isServersPending,
      failed: isCentralServersFailed,
    },
    innReachLocations: {
      records: innReachLoc,
      isPending: isInnReachLocPending,
      failed: isInnReachLocationsFailed,
    },
    folioLibraries: {
      records: libraries,
      isPending: isFolioLibrariesPending,
      failed: isFolioLibrariesFailed,
    },
    folioLocations: {
      records: locations,
      isPending: isFolioLocationsPending,
      failed: isFolioLocationsFailed,
    },
    locationMappings: {
      records: locationMappings,
      isPending: isLocationMappingsPending,
      failed: isLocationMappingsFailed,
    },
    libraryMappings: {
      records: libraryMappings,
      isPending: isLibraryMappingsPending,
      failed: isLibraryMappingsFailed,
    },
  },
  history,
  mutator,
}) => {
  const centralServers = servers[0]?.centralServers || [];
  const innReachLocations = innReachLoc[0]?.locations || [];
  const folioLocations = locations[0]?.locations || [];
  const folioLibraries = libraries[0]?.loclibs || [];

  const [mappingType, setMappingType] = useState('');
  const [nextMappingType, setNextMappingType] = useState('');
  const [prevMappingType, setPrevMappingType] = useState('');

  const [librarySelection, setLibrarySelection] = useState('');
  const [nextLibrarySelection, setNextLibrarySelection] = useState('');
  const [prevLibrarySelection, setPrevLibrarySelection] = useState('');

  const [initialValues, setInitialValues] = useState({});
  const [serverLibrariesOptions, setServerLibrariesOptions] = useState([]);

  const [locationMappingsMap, setLocationMappingsMap] = useState(null);
  const [librariesMappingsMap, setLibrariesMappingsMap] = useState(null);

  const extraNavigationConditions = [mappingType, librarySelection];

  const [
    selectedServer,
    openModal,
    isResetForm,
    isPristine,
    serverOptions,
    changePristineState,
    changeFormResetState,
    handleServerChange,
    handleModalConfirm,
    handleModalCancel,
    changeModalState,
    changeNextServer,
    changeSelectedServer,
    changePrevServerName,
  ] = useCentralServers(history, centralServers, extraNavigationConditions);

  const { formatMessage } = useIntl();
  const showCallout = useCallout();

  const librariesMappingType = formatMessage({ id: 'ui-inn-reach.settings.folio-to-inn-reach-locations.field-value.libraries' });
  const locationsMappingType = formatMessage({ id: 'ui-inn-reach.settings.folio-to-inn-reach-locations.field-value.locations' });
  const mappingTypePlaceholder = formatMessage({ id: 'ui-inn-reach.settings.folio-to-inn-reach-locations.placeholder.select-type-to-map' });

  const mappingTypesOptions = [
    {
      value: mappingTypePlaceholder,
      label: mappingTypePlaceholder,
    },
    {
      value: librariesMappingType,
      label: librariesMappingType,
    },
    {
      value: locationsMappingType,
      label: locationsMappingType,
    },
  ];

  const changeServer = (serverName) => {
    const optedServer = centralServers.find(server => server.name === serverName);
    const isNewServerSelected = selectedServer.name !== serverName;

    if (isNewServerSelected) {
      if (mappingType) {
        changeModalState(true);
        changeNextServer(selectedServer);
      } else {
        changeSelectedServer(optedServer);
      }
    }

    changePrevServerName(selectedServer.name);
  };

  const changeMappingType = (selectedMappingType) => {
    const isNewMappingTypeSelected = selectedMappingType !== mappingType;

    if (isNewMappingTypeSelected) {
      if (isPristine) {
        setMappingType(selectedMappingType);
      } else {
        changeModalState(true);
        setNextMappingType(selectedMappingType);
      }
    }

    setPrevMappingType(mappingType);
    setLibrarySelection('');
  };

  const handleChangeLibrary = (selectedLibraryName) => {
    const isNewLibrarySelected = selectedLibraryName !== librarySelection;
    const libraryId = serverLibrariesOptions.find(library => library.value === selectedLibraryName).id;

    if (isNewLibrarySelected) {
      if (isPristine) {
        setLibrarySelection(selectedLibraryName);
        mutator.selectedLibraryId.replace(libraryId);
      } else {
        changeModalState(true);
        setNextLibrarySelection(selectedLibraryName);
      }
    }

    setPrevLibrarySelection(librarySelection);
  };

  const backPrevLibrary = () => {
    const index = serverLibrariesOptions.findIndex(lib => lib.value === prevLibrarySelection);
    const prevOption = document.getElementById(`option-${LIBRARY}-${index}-${prevLibrarySelection}`);

    if (prevOption) prevOption.click();
  };

  const processModalConfirm = () => {
    if (prevMappingType) { // if a new mapping type was selected
      setPrevMappingType('');
    } else if (prevLibrarySelection) { // if a new library was selected
      backPrevLibrary();
      setPrevLibrarySelection('');
    }

    handleModalConfirm();
  };

  const processModalCancel = () => {
    if (prevMappingType) { // if a new mapping type was selected
      setMappingType(nextMappingType);
    } else if (prevLibrarySelection) {
      const libraryId = serverLibrariesOptions.find(library => library.value === nextLibrarySelection).id;

      setLibrarySelection(nextLibrarySelection);
      mutator.selectedLibraryId.replace(libraryId);
    } else {
      setMappingType('');
      setLibrarySelection('');
    }

    handleModalCancel({ isStopServerReset: prevMappingType || prevLibrarySelection });
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

  useEffect(() => {
    if (
      isCentralServersFailed ||
      isInnReachLocationsFailed ||
      isFolioLibrariesFailed ||
      isFolioLocationsFailed
    ) {
      showCallout({
        type: CALLOUT_ERROR_TYPE,
        message: <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.callout.connectionProblem.get" />,
      });
    }
  }, [
    isCentralServersFailed,
    isInnReachLocationsFailed,
    isFolioLibrariesFailed,
    isFolioLocationsFailed,
  ]);

  useEffect(() => {
    if (mappingType) {
      const libraryOptions = getLibraryOptions({
        localAgencies: selectedServer.localAgencies,
        folioLibraries,
      });

      if (mappingType === librariesMappingType) {
        mutator.selectedLibraryId.replace('');
      }

      setServerLibrariesOptions(libraryOptions);

      if (mappingType === librariesMappingType) {
        mutator.libraryMappings.GET();
      }
    }
  }, [mappingType]);

  useEffect(() => {
    if (selectedLibraryId) {
      mutator.locationMappings.GET();
    }
  }, [selectedLibraryId]);

  useEffect(() => {
    if (selectedLibraryId && !isEmpty(folioLibraries) && !isEmpty(folioLocations)) {
      if (isLocationMappingsFailed) {
        setInitialValues({
          [TABULAR_LIST]: getLeftColumnLocations({
            selectedLibraryId,
            folioLocations,
            folioLibraries,
          }),
        });
      } else if (!isEmpty(locationMappings) && !isEmpty(innReachLocations)) {
        const locMappings = locationMappings[0].locationMappings;
        const locMappingsMap = getLocationMappingsMap(locMappings);

        setLocationMappingsMap(locMappingsMap);

        setInitialValues({
          [TABULAR_LIST]: getTabularListForLocations({
            locationMappingsMap: locMappingsMap,
            selectedLibraryId,
            folioLocations,
            innReachLocations,
            folioLibraries,
          }),
        });
      }
    }
  }, [locationMappings, isLocationMappingsFailed]);

  useEffect(() => {
    if (!isEmpty(serverLibrariesOptions)) {
      if (isLibraryMappingsFailed) {
        setInitialValues({
          [TABULAR_LIST]: getLeftColumnLibraries(serverLibrariesOptions),
        });
      } else if (!isEmpty(libraryMappings) && !isEmpty(innReachLocations)) {
        const libMappings = libraryMappings[0].libraryMappings;
        const libMappingsMap = getLibrariesMappingsMap(libMappings);

        setLibrariesMappingsMap(libMappingsMap);

        setInitialValues({
          [TABULAR_LIST]: getLibrariesTabularList({
            libraryMappingsMap: libMappingsMap,
            serverLibrariesOptions,
            innReachLocations,
          }),
        });
      }
    }
  }, [libraryMappings, isLibraryMappingsFailed]);

  useEffect(() => {
    // if we navigate to the current page or leave from the page or change server
    if (isPristine && !prevMappingType && !prevLibrarySelection) {
      setMappingType('');
      setLibrarySelection('');
    }

    setPrevMappingType('');
    setPrevLibrarySelection('');

    mutator.selectedServerId.replace(selectedServer.id || '');
  }, [selectedServer, isPristine]);

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
        isLocationMappingsPending={isLocationMappingsPending}
        isLibraryMappingsPending={isLibraryMappingsPending}
        selectedLibraryId={selectedLibraryId}
        mappingTypesOptions={mappingTypesOptions}
        formatMessage={formatMessage}
        librariesMappingType={librariesMappingType}
        locationsMappingType={locationsMappingType}
        initialValues={initialValues}
        isResetForm={isResetForm}
        onSubmit={handleSubmit}
        onChangePristineState={changePristineState}
        onChangeFormResetState={changeFormResetState}
        onChangeServer={changeServer}
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
        onCancel={processModalCancel}
        onConfirm={processModalConfirm}
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
    libraryMappings: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
      isPending: PropTypes.bool.isRequired,
      failed: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    }).isRequired,
    locationMappings: PropTypes.shape({
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
