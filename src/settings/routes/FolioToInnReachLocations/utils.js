import {
  flatMap,
} from 'lodash';
import {
  FOLIO_TO_INN_REACH_LOCATION_FIELDS,
} from '../../../constants';

const {
  INN_REACH_LOCATIONS,
  FOLIO_LIBRARY,
  FOLIO_LOCATION,
  CODE,
} = FOLIO_TO_INN_REACH_LOCATION_FIELDS;

export const getLibraryIdsSetOfSelectedServer = (localAgencies) => {
  const libraryIdsSetOfSelectedServer = new Set();

  localAgencies.forEach(({ folioLibraryIds }) => {
    folioLibraryIds.forEach(libraryId => {
      libraryIdsSetOfSelectedServer.add(libraryId);
    });
  });

  return libraryIdsSetOfSelectedServer;
};

export const getServerLibraries = (localAgencies, folioLibraries) => {
  const libraryIdsSetOfSelectedServer = getLibraryIdsSetOfSelectedServer(localAgencies);
  const formattedLibraries = [];

  for (const { id, name, code } of folioLibraries) {
    if (formattedLibraries.length === libraryIdsSetOfSelectedServer.size) break;

    if (libraryIdsSetOfSelectedServer.has(id)) {
      const option = {
        id,
        label: `${name} (${code})`,
        value: name,
        code,
      };

      formattedLibraries.push(option);
    }
  }

  return formattedLibraries;
};

const getCampusId = ({
  selectedLibraryId,
  folioLibraries,
}) => {
  return folioLibraries.find(library => library.id === selectedLibraryId).campusId;
};

export const getFinalLocationMappings = ({
  folioLocations,
  tabularListMap,
  locationMappingsMap,
}) => {
  return folioLocations.reduce((accum, { id, code }) => {
    if (tabularListMap.has(code)) {
      const innReachLocationId = tabularListMap.get(code);

      if (innReachLocationId) { // if there is an Inn-Reach code in the right column
        let entityId;

        if (locationMappingsMap?.has(id)) { // if the Inn-Reach code from the BE data
          const isTabularRowChanged = locationMappingsMap.get(id).innReachLocationId !== innReachLocationId;

          if (!isTabularRowChanged) {
            entityId = locationMappingsMap.get(id).id;
          }
        }

        const locMapping = {
          locationId: id,
          innReachLocationId,
        };

        if (entityId) { // if user did not change Inn-Reach code in the right column
          locMapping.id = entityId;
        }

        accum.push(locMapping);
      }
    }

    return accum;
  }, []);
};

export const getFinalLibraryMappings = ({
  folioLibraries,
  tabularListMap,
  librariesMappingsMap,
}) => {
  return folioLibraries.reduce((accum, { id, code }) => {
    if (tabularListMap.has(code)) {
      const innReachLocationId = tabularListMap.get(code);

      if (innReachLocationId) { // if there is an Inn-Reach code in the right column
        let entityId;

        if (librariesMappingsMap?.has(id)) { // if the Inn-Reach code from the BE data
          const isTabularRowChanged = librariesMappingsMap.get(id).innReachLocationId !== innReachLocationId;

          if (!isTabularRowChanged) {
            entityId = librariesMappingsMap.get(id).id;
          }
        }

        const libMapping = {
          libraryId: id,
          innReachLocationId,
        };

        if (entityId) { // if user did not change Inn-Reach code in the right column
          libMapping.id = entityId;
        }

        accum.push(libMapping);
      }
    }

    return accum;
  }, []);
};

export const getLocationMappingsMap = (locationMappings) => {
  const locationMappingsMap = new Map();

  locationMappings.forEach(({ id, locationId, innReachLocationId }) => {
    locationMappingsMap.set(locationId, { id, innReachLocationId });
  });

  return locationMappingsMap;
};

export const getLibrariesMappingsMap = (libraryMappings) => {
  const libraryMappingsMap = new Map();

  libraryMappings.forEach(({ id, libraryId, innReachLocationId }) => {
    libraryMappingsMap.set(libraryId, { id, innReachLocationId });
  });

  return libraryMappingsMap;
};

export const getLeftColumnLocations = ({
  selectedLibraryId,
  folioLocations,
  folioLibraries,
}) => {
  const selectedLibraryCampusId = getCampusId({ selectedLibraryId, folioLibraries });

  return folioLocations.reduce((accum, { name, code, campusId }) => {
    if (campusId === selectedLibraryCampusId) {
      accum.push({
        [FOLIO_LOCATION]: `${name} (${code})`,
        [CODE]: code,
      });
    }

    return accum;
  }, []);
};

const getFolioLibraryIdsSet = (folioLibraryIds) => {
  return folioLibraryIds.reduce((accum, libId) => {
    accum.add(libId);

    return accum;
  }, new Set());
};

export const getLeftColumnLibraries = (serverLibraries, folioLibraryIds) => {
  const folioLibraryIdsSet = getFolioLibraryIdsSet(folioLibraryIds);

  return serverLibraries
    .filter(({ id }) => folioLibraryIdsSet.has(id))
    .map(({ label, code }) => ({
      [FOLIO_LIBRARY]: label,
      [CODE]: code,
    }));
};

export const getTabularListForLocations = ({
  locMappingsMap,
  selectedLibraryId,
  folioLocations,
  folioLibraries,
}) => {
  const selectedLibraryCampusId = getCampusId({ selectedLibraryId, folioLibraries });

  return folioLocations.reduce((accum, { id, name, code, campusId }) => {
    if (campusId === selectedLibraryCampusId) {
      const option = {
        [FOLIO_LOCATION]: `${name} (${code})`,
        [CODE]: code,
      };
      const isCodeSelected = locMappingsMap.has(id);

      if (isCodeSelected) {
        const innReachLocationId = locMappingsMap.get(id).innReachLocationId;

        option[INN_REACH_LOCATIONS] = innReachLocationId;
      }

      accum.push(option);
    }

    return accum;
  }, []);
};

export const getLibrariesTabularList = ({
  serverLibraries,
  libMappingsMap,
  folioLibraryIds,
}) => {
  const folioLibraryIdsSet = getFolioLibraryIdsSet(folioLibraryIds);

  return serverLibraries
    .filter(({ id }) => folioLibraryIdsSet.has(id))
    .map(({ id, label, code }) => {
      const option = {
        [FOLIO_LIBRARY]: label,
        [CODE]: code,
      };
      const isCodeSelected = libMappingsMap.has(id);

      if (isCodeSelected) {
        const innReachLocationId = libMappingsMap.get(id).innReachLocationId;

        option[INN_REACH_LOCATIONS] = innReachLocationId;
      }

      return option;
    });
};

export const getTabularListMap = (record) => {
  const tabularListMap = new Map();
  const tabularLists = flatMap(record, tabularList => tabularList);

  tabularLists.forEach(row => {
    tabularListMap.set(row[CODE], row[INN_REACH_LOCATIONS]);
  });

  return tabularListMap;
};

export const getAgencyCodeToLibraryMap = (localAgencies) => {
  const agencyCodeToLibraryMap = new Map();

  localAgencies.forEach(({ code, folioLibraryIds }) => {
    folioLibraryIds.forEach(libId => {
      agencyCodeToLibraryMap.set(libId, code);
    });
  });

  return agencyCodeToLibraryMap;
};

export const getSelectedLocationsByAgencyCode = (allMappings, agencyCodeToLibraryMap) => {
  return allMappings.reduce((accum, { libraryId, innReachLocationId }) => {
    const code = agencyCodeToLibraryMap.get(libraryId);

    if (accum[code]) {
      accum[code].push(innReachLocationId);
    } else {
      accum[code] = [innReachLocationId];
    }

    return accum;
  }, {});
};
