import {
  chunk,
} from 'lodash';
import {
  roundHours,
} from '../../utils';
import {
  ASC_ORDER,
  CREATED_DATE_OPERATIONS,
  DUE_DATE,
  HOLD_FIELDS,
  METADATA_FIELDS,
  SORT_ORDER_PARAMETER,
  SORT_PARAMETER,
  TRANSACTION_FIELDS,
  TRANSACTION_LIST_DEFAULT_SORT_FIELD,
  TRANSACTION_OPERATIONS,
  TRANSACTION_STATUSES,
  TRANSACTION_TYPES,
  FIELDS_OF_REPORT_MODALS,
} from '../../constants';

const {
  DUE_DATE_OP,
  UPDATED_DATE_OP,
  CREATED_DATE_OP,
} = TRANSACTION_OPERATIONS;

const {
  MINIMUM_DAYS_RETURNED,
  MINIMUM_DAYS_OVERDUE,
  MINIMUM_DAYS_REQUESTED,
  MINIMUM_DAYS_PAGED,
  MINIMUM_DAYS_SHIPPED,
} = FIELDS_OF_REPORT_MODALS;

const {
  HOLD,
  STATUS,
  TYPE,
  CENTRAL_SERVER_CODE,
} = TRANSACTION_FIELDS;

const {
  FOLIO_ITEM_ID,
  PATRON_AGENCY_CODE,
  ITEM_AGENCY_CODE,
} = HOLD_FIELDS;

const {
  ITEM,
  PATRON,
  LOCAL,
} = TRANSACTION_TYPES;

const {
  OWNER_RENEW,
  ITEM_RECEIVED,
  ITEM_SHIPPED,
  ITEM_IN_TRANSIT,
  BORROWER_RENEW,
  PATRON_HOLD,
  TRANSFER,
  RETURN_UNCIRCULATED,
  ITEM_HOLD,
  LOCAL_HOLD,
} = TRANSACTION_STATUSES;

const {
  UPDATED_DATE,
} = METADATA_FIELDS;

const {
  LESS,
} = CREATED_DATE_OPERATIONS;

const TOMORROW = 1;
const GENERAL_PARAMS = {
  [SORT_PARAMETER]: TRANSACTION_LIST_DEFAULT_SORT_FIELD,
  [SORT_ORDER_PARAMETER]: ASC_ORDER,
};

export const formatDateAndTime = (date, formatter) => {
  return date ? formatter(date, { day: 'numeric', month: 'numeric', year: 'numeric' }) : '';
};

const getAgencyCodeMap = (localServers) => {
  return localServers.reduce((accum, { localServerList }) => {
    localServerList.forEach(({ agencyList }) => {
      agencyList.forEach(({ agencyCode, description }) => {
        accum.set(agencyCode, description);
      });
    });

    return accum;
  }, new Map());
};

const getLoansMap = (loans) => {
  return loans.reduce((accum, loan) => {
    if (loan[HOLD][FOLIO_ITEM_ID]) {
      accum.set(loan[HOLD][FOLIO_ITEM_ID], loan);
    }

    return accum;
  }, new Map());
};

const getCentralServerCodesSet = (loans) => {
  return loans.reduce((accum, loan) => {
    accum.add(loan[CENTRAL_SERVER_CODE]);

    return accum;
  }, new Set());
};

const getCentralServersMap = (centralServers) => {
  return centralServers.reduce((accum, { centralServerCode, id }) => {
    accum.set(centralServerCode, id);

    return accum;
  }, new Map());
};

const fetchLocalServers = async (mutator, loans) => {
  const centralServerCodesSet = getCentralServerCodesSet(loans);
  const requests = [];
  const { centralServers } = await mutator.centralServerRecords.GET();
  const centralServersMap = getCentralServersMap(centralServers);

  centralServerCodesSet.forEach(centralServerCode => {
    const centralServerId = centralServersMap.get(centralServerCode);
    const request = mutator.localServers.GET({
      path: `inn-reach/central-servers/${centralServerId}/d2r/contribution/localservers`,
    });

    requests.push(request);
  });

  return Promise.all(requests);
};

const fetchBatchItems = async (mutator, loans) => {
  // Split the list of items into small chunks to create a short enough query string
  // that we can avoid request with error
  const CHUNK_SIZE = 77;
  const LIMIT = 1000;
  const chunkedItems = chunk(loans, CHUNK_SIZE);

  mutator.items.reset();

  const allRequests = chunkedItems.map(itemChunk => {
    const query = itemChunk
      .map(item => `id==${item[HOLD][FOLIO_ITEM_ID]}`)
      .join(' or ');

    return mutator.items.GET({ params: { limit: LIMIT, query } });
  });

  return Promise.all(allRequests).then(res => {
    return res.map(itemResp => itemResp.items).flat();
  });
};

const getLastModifiedDate = (minDays) => {
  const date = new Date();

  date.setDate(date.getDate() - minDays + TOMORROW);
  date.setHours(0, 0, 0, 0);

  return date.toISOString();
};

export const getParamsForOverdueReport = (record) => {
  const overdueDate = new Date();

  overdueDate.setDate(overdueDate.getDate() - record[MINIMUM_DAYS_OVERDUE]);

  return {
    ...GENERAL_PARAMS,
    [TYPE]: ITEM,
    [STATUS]: [ITEM_RECEIVED, BORROWER_RENEW, OWNER_RENEW, ITEM_IN_TRANSIT, ITEM_SHIPPED],
    [DUE_DATE]: roundHours(overdueDate).toISOString(),
    [DUE_DATE_OP]: LESS,
  };
};

export const getParamsForRequestedTooLongReport = (record) => {
  return {
    ...GENERAL_PARAMS,
    [TYPE]: PATRON,
    [STATUS]: [PATRON_HOLD, TRANSFER],
    [UPDATED_DATE]: getLastModifiedDate(record[MINIMUM_DAYS_REQUESTED]),
    [UPDATED_DATE_OP]: LESS,
  };
};

export const getParamsForReturnedTooLongReport = (record) => {
  return {
    ...GENERAL_PARAMS,
    [TYPE]: PATRON,
    [STATUS]: [ITEM_IN_TRANSIT, RETURN_UNCIRCULATED],
    [UPDATED_DATE]: getLastModifiedDate(record[MINIMUM_DAYS_RETURNED]),
    [UPDATED_DATE_OP]: LESS,
  };
};

export const getParamsForOwningSitePagedTooLongReport = (record) => {
  return {
    ...GENERAL_PARAMS,
    [TYPE]: [ITEM, LOCAL],
    [STATUS]: [ITEM_HOLD, LOCAL_HOLD, TRANSFER],
    [CREATED_DATE_OP]: getLastModifiedDate(record[MINIMUM_DAYS_PAGED]),
    [CREATED_DATE_OP]: LESS,
  };
};

export const getParamsForInTransitTooLongReport = (record) => {
  return {
    ...GENERAL_PARAMS,
    [TYPE]: PATRON,
    [STATUS]: [ITEM_SHIPPED],
    [UPDATED_DATE]: getLastModifiedDate(record[MINIMUM_DAYS_SHIPPED]),
    [UPDATED_DATE_OP]: LESS,
  };
};

export const getData = async (mutator, loans) => {
  const [localServers, items] = await Promise.all([
    fetchLocalServers(mutator, loans),
    fetchBatchItems(mutator, loans),
  ]);

  return {
    agencyCodeMap: getAgencyCodeMap(localServers),
    loansMap: getLoansMap(loans),
    items,
  };
};

export const getAgencyData = (loansMap, item, agencyCodeMap) => {
  const holdData = loansMap.get(item.id)[HOLD];
  const patronAgencyCode = holdData[PATRON_AGENCY_CODE];
  const itemAgencyCode = holdData[ITEM_AGENCY_CODE];

  return {
    patronAgencyCode,
    itemAgencyCode,
    itemAgencyDescription: agencyCodeMap.get(itemAgencyCode),
    patronAgencyDescription: agencyCodeMap.get(patronAgencyCode),
    holdData,
  };
};
