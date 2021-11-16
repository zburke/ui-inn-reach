import {
  useState,
  useCallback,
} from 'react';

import {
  ASC_ORDER,
  DESC_ORDER,
  SORT_ORDER_PARAMETER,
  SORT_PARAMETER,
} from '../constants';

const useSorting = (resetData, sortableFields) => {
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  const toggleSortOrder = useCallback(
    () => {
      const newSortOrder = sortOrder === ASC_ORDER
        ? DESC_ORDER
        : ASC_ORDER;

      setSortOrder(newSortOrder);

      return newSortOrder;
    },
    [sortOrder],
  );

  const changeSorting = useCallback(
    (e, meta) => {
      const newSortField = meta.name;

      if (sortableFields && !sortableFields.includes(newSortField)) {
        return {
          [SORT_PARAMETER]: sortField,
          [SORT_ORDER_PARAMETER]: sortOrder,
        };
      }

      let newSort;

      if (newSortField === sortField) {
        newSort = {
          [SORT_PARAMETER]: sortField,
          [SORT_ORDER_PARAMETER]: toggleSortOrder(),
        };
      } else {
        setSortField(newSortField);
        setSortOrder(ASC_ORDER);

        newSort = {
          [SORT_PARAMETER]: newSortField,
          [SORT_ORDER_PARAMETER]: ASC_ORDER,
        };
      }

      resetData();

      return newSort;
    },
    [resetData, sortField, sortOrder, toggleSortOrder, sortableFields],
  );

  const resetSorting = useCallback(
    () => {
      setSortField('');
      setSortOrder('');
      resetData();
    },
    [resetData],
  );

  return [
    sortField,
    sortOrder,
    changeSorting,
    setSortField,
    setSortOrder,
    resetSorting,
  ];
};

export default useSorting;
