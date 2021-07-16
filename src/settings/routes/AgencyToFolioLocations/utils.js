import {
  omit,
} from 'lodash';
import {
  AGENCY_TO_FOLIO_LOCATIONS_FIELDS,
} from '../../../constants';

const {
  AGENCY,
  AGENCY_CODE_MAPPINGS,
  LIBRARY_ID,
  LOCATION_ID,
  LOCAL_CODE,
  LOCAL_SERVER_LIBRARY_ID,
  LOCAL_SERVER_LOCATION_ID,
} = AGENCY_TO_FOLIO_LOCATIONS_FIELDS;

const getMapByCampusId = (folioLibraries) => {
  const mapByCampusId = new Map();

  folioLibraries.forEach(({ id, code, campusId }) => {
    mapByCampusId.set(campusId, {
      libId: id,
      libCode: code,
    });
  });

  return mapByCampusId;
};

const getMapByInstitutionId = (campuses, mapByCampusId) => {
  const mapByInstitutionId = new Map();

  campuses.forEach(({ id, code, institutionId }) => {
    if (mapByCampusId.has(id)) {
      mapByInstitutionId.set(institutionId, {
        ...mapByCampusId.get(id),
        campusCode: code,
      });
    }
  });

  return mapByInstitutionId;
};

export const getFolioLibraryOptions = ({
  folioLibraries,
  campuses,
  institutions,
}) => {
  const libOptions = [];
  const mapByCampusId = getMapByCampusId(folioLibraries);
  const mapByInstitutionId = getMapByInstitutionId(campuses, mapByCampusId);

  institutions.forEach(({ id, code: institutionCode }) => {
    if (mapByInstitutionId.has(id)) {
      const {
        libId,
        libCode,
        campusCode,
      } = mapByInstitutionId.get(id);

      const option = {
        id: libId,
        label: `${institutionCode} > ${campusCode} > ${libCode}`,
        value: libId,
      };

      libOptions.push(option);
    }
  });

  return libOptions;
};

export const getFolioLocationsMap = (folioLocations) => {
  return folioLocations.reduce((accum, { id, name, code, libraryId }) => {
    const locData = { id, name, code };

    if (accum.has(libraryId)) {
      accum.get(libraryId).push(locData);
    } else {
      accum.set(libraryId, [locData]);
    }

    return accum;
  }, new Map());
};

export const getFolioLocationOptions = (folioLocationsMap, libraryId) => {
  const locationsBySelectedLib = folioLocationsMap.get(libraryId);

  return locationsBySelectedLib.map(({ id, name, code }) => ({
    id,
    label: `${name} (${code})`,
    value: id,
  }));
};

const getAgencyCodeMappingsMap = (agencyCodeMappings) => {
  const agencyCodeMappingsMap = new Map();

  agencyCodeMappings.forEach(({ id, agencyCode, libraryId, locationId }) => {
    const fieldset = { id, libraryId };

    if (locationId) {
      fieldset[LOCATION_ID] = locationId;
    }
    agencyCodeMappingsMap.set(agencyCode, fieldset);
  });

  return agencyCodeMappingsMap;
};

export const getAgencyCodeMappings = (agencyCodeMappings, localServerList, localServerCode) => {
  const { agencyList } = localServerList.find(({ localCode }) => localCode === localServerCode);
  const agencyCodeMappingsMap = getAgencyCodeMappingsMap(agencyCodeMappings);

  return agencyList.map(({ agencyCode, description }) => {
    let option = {
      [AGENCY]: `${agencyCode} (${description})`,
    };

    if (agencyCodeMappingsMap.has(agencyCode)) {
      option = {
        ...option,
        ...agencyCodeMappingsMap.get(agencyCode),
      };
    }

    return option;
  });
};

export const getLeftColumn = (localServerList, selectedLocalCode) => {
  const { agencyList } = localServerList.find(localServer => localServer.localCode === selectedLocalCode);

  return agencyList.map(({ agencyCode, description }) => ({
    [AGENCY]: `${agencyCode} (${description})`,
  }));
};

export const getLocalInitialValues = (localServerList, agencyMappings, selectedLocalCode, locServerData) => {
  const agencyChanges = locServerData.agencyCodeMappings;
  const agencyCodeMappings = agencyChanges
    ? getAgencyCodeMappings(agencyChanges, localServerList, selectedLocalCode)
    : getLeftColumn(localServerList, selectedLocalCode);

  return {
    ...omit(locServerData, AGENCY_CODE_MAPPINGS),
    [LOCAL_CODE]: selectedLocalCode,
    [AGENCY_CODE_MAPPINGS]: agencyCodeMappings,
  };
};

export const getLocalServerData = (agencyMappings, selectedLocalCode) => {
  return agencyMappings.localServers?.find(({ localCode }) => localCode === selectedLocalCode);
};

const getFormattedAgencyCodeMappings = (agencyCodeMappings) => {
  return agencyCodeMappings.map(({ id, agency, libraryId, locationId }) => {
    const rowData = {
      agencyCode: agency.slice(0, 5),
    };

    if (id) rowData.id = id;
    if (libraryId) rowData[LIBRARY_ID] = libraryId;
    if (locationId) rowData[LOCATION_ID] = locationId;

    return rowData;
  });
};

const getFormattedLocalServerData = (record) => {
  const {
    localCode,
    localServerLibraryId,
    localServerLocationId,
    agencyCodeMappings,
  } = record;
  const formattedLocalServerData = { localCode };

  if (localServerLibraryId) {
    formattedLocalServerData[LOCAL_SERVER_LIBRARY_ID] = localServerLibraryId;
  }
  if (localServerLocationId) {
    formattedLocalServerData[LOCAL_SERVER_LOCATION_ID] = localServerLocationId;
  }

  formattedLocalServerData[AGENCY_CODE_MAPPINGS] = getFormattedAgencyCodeMappings(agencyCodeMappings);

  return formattedLocalServerData;
};

export const getLocalServers = (record, agencyMappings) => {
  const dataOfLocalServers = [];
  let isNewLocalServerDataCreated = true;

  if (agencyMappings.localServers) {
    agencyMappings.localServers.forEach(localServerData => {
      if (localServerData.localCode === record[LOCAL_CODE]) {
        dataOfLocalServers.push(getFormattedLocalServerData(record));
        isNewLocalServerDataCreated = false;
      } else {
        dataOfLocalServers.push(localServerData);
      }
    });
  }

  if (isNewLocalServerDataCreated) {
    dataOfLocalServers.push(getFormattedLocalServerData(record));
  }

  return dataOfLocalServers;
};
