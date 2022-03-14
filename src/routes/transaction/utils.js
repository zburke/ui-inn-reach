import {
  chunk,
} from 'lodash';
import {
  roundHours,
} from '../../utils';
import {
  ASC_ORDER,
  CREATED_DATE_OP,
  CREATED_DATE_OPERATIONS,
  HOLD_FIELDS,
  METADATA_FIELDS,
  OWNING_SITE_OVERDUE_FIELDS,
  SORT_ORDER_PARAMETER,
  SORT_PARAMETER,
  TRANSACTION_FIELDS,
  TRANSACTION_LIST_DEFAULT_SORT_FIELD,
  TRANSACTION_STATUSES,
  TRANSACTION_TYPES,
} from '../../constants';

const {
  MINIMUM_DAYS_OVERDUE,
} = OWNING_SITE_OVERDUE_FIELDS;

const {
  HOLD,
  STATUS,
  TYPE,
  CENTRAL_SERVER_CODE,
} = TRANSACTION_FIELDS;

const {
  FOLIO_ITEM_ID,
  FOLIO_ITEM_BARCODE,
} = HOLD_FIELDS;

const {
  ITEM,
} = TRANSACTION_TYPES;

const {
  OWNER_RENEW,
  ITEM_RECEIVED,
  ITEM_SHIPPED,
  ITEM_IN_TRANSIT,
  BORROWER_RENEW,
} = TRANSACTION_STATUSES;

const {
  UPDATED_DATE,
} = METADATA_FIELDS;

const {
  LESS,
} = CREATED_DATE_OPERATIONS;

export const formatDateAndTime = (date, formatter) => {
  return date ? formatter(date, { day: 'numeric', month: 'numeric', year: 'numeric' }) : '';
};

export const getAgencyCodeMap = (localServers) => {
  return localServers.reduce((accum, { localServerList }) => {
    localServerList.forEach(({ agencyList }) => {
      agencyList.forEach(({ agencyCode, description }) => {
        accum.set(agencyCode, description);
      });
    });

    return accum;
  }, new Map());
};

export const getLoansMap = (loans) => {
  return loans.reduce((accum, loan) => {
    accum.set(loan[HOLD][FOLIO_ITEM_ID], loan);

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

export const fetchLocalServers = async (mutator, loans) => {
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

export const fetchBatchItems = async (mutator, loans) => {
  // Split the list of items into small chunks to create a short enough query string
  // that we can avoid request with error
  const CHUNK_SIZE = 100;
  const LIMIT = 1000;
  const chunkedItems = chunk(loans, CHUNK_SIZE);

  mutator.items.reset();

  const allRequests = chunkedItems.map(itemChunk => {
    const query = itemChunk
      .map(item => `barcode==${item[HOLD][FOLIO_ITEM_BARCODE]}`)
      .join(' or ');

    return mutator.items.GET({ params: { limit: LIMIT, query } });
  });

  return Promise.all(allRequests).then(res => {
    return res.map(itemResp => itemResp.items).flat();
  });
};

export const getOverdueParams = (record) => {
  const overdueDate = new Date();

  overdueDate.setDate(overdueDate.getDate() - record[MINIMUM_DAYS_OVERDUE]);

  return {
    [SORT_PARAMETER]: TRANSACTION_LIST_DEFAULT_SORT_FIELD,
    [SORT_ORDER_PARAMETER]: ASC_ORDER,
    [TYPE]: ITEM,
    [STATUS]: [ITEM_RECEIVED, BORROWER_RENEW, OWNER_RENEW, ITEM_IN_TRANSIT, ITEM_SHIPPED],
    [UPDATED_DATE]: roundHours(overdueDate).toISOString(),
    [CREATED_DATE_OP]: LESS,
  };
};
