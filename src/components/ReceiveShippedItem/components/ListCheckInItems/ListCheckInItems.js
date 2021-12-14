import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';

import {
  MultiColumnList,
} from '@folio/stripes-components';

import {
  RECEIVED_ITEM_FIELDS,
  FOLIO_CHECK_IN_FIELDS,
} from '../../../../constants';
import {
  ItemActions,
} from './components';

const {
  NO,
  BARCODE,
  TITLE,
  PICK_UP_LOCATION,
  ACTIONS,
} = RECEIVED_ITEM_FIELDS;

const {
  ITEM,
} = FOLIO_CHECK_IN_FIELDS;

const visibleColumns = [
  NO,
  BARCODE,
  TITLE,
  PICK_UP_LOCATION,
  ACTIONS,
];

const columnMapping = {
  [NO]: <FormattedMessage id="ui-inn-reach.shipped-items.column.no" />,
  [BARCODE]: <FormattedMessage id="ui-inn-reach.shipped-items.column.barcode" />,
  [TITLE]: <FormattedMessage id="ui-inn-reach.shipped-items.column.title" />,
  [PICK_UP_LOCATION]: <FormattedMessage id="ui-inn-reach.shipped-items.column.pickup-location" />,
  [ACTIONS]: <FormattedMessage id="ui-inn-reach.shipped-items.column.actions" />,
};

const columnWidths = {
  [NO]: { max: 60 },
  [BARCODE]: { max: 200 },
  [TITLE]: { max: 350 },
  [PICK_UP_LOCATION]: { max: 500 },
  [ACTIONS]: { max: 50 },
};

const ListCheckInItems = ({
  scannedItems,
  intl,
}) => {
  const items = scannedItems.map((item, index) => ({
    ...item,
    [NO]: index + 1,
  }));

  const getItemFormatter = () => ({
    [NO]: loan => intl.formatNumber(loan[NO]),
    [BARCODE]: loan => loan[ITEM]?.[BARCODE],
    [TITLE]: loan => loan[ITEM]?.[TITLE],
    [PICK_UP_LOCATION]: loan => loan[PICK_UP_LOCATION],
    [ACTIONS]: (loan) => (
      <ItemActions
        loan={loan}
        intl={intl}
      />
    ),
  });

  return (
    <MultiColumnList
      contentData={items}
      columnWidths={columnWidths}
      interactive={false}
      formatter={getItemFormatter()}
      visibleColumns={visibleColumns}
      columnMapping={columnMapping}
      isEmptyMessage={<FormattedMessage id="ui-inn-reach.no-items-entered" />}
    />
  );
};

ListCheckInItems.propTypes = {
  intl: PropTypes.object.isRequired,
  scannedItems: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ListCheckInItems;
