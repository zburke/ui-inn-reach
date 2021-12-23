import {
  FormattedMessage,
} from 'react-intl';
import {
  isEmpty,
} from 'lodash';

import {
  Paneset,
  Pane,
  Icon,
  PaneFooter,
  Button,
} from '@folio/stripes-components';

import {
  NavigationMenu,
} from '../../../common';
import {
  FILL_PANE_WIDTH,
  FILTER_PANE_WIDTH,
  getReceiveShippedItemUrl,
  ICONS,
} from '../../../../constants';
import {
  ItemForm,
  ListCheckInItems,
} from './components';
import css from './CheckIn.css';

const CheckIn = ({
  history,
  location,
  stripes,
  isLoading,
  intl,
  itemFormRef,
  barcodeRef,
  scannedItems,
  onGetSlipTemplate,
  onSessionEnd,
  onSubmit,
}) => {
  return (
    <div className={css.container}>
      <Paneset static>
        <Pane
          defaultWidth={FILTER_PANE_WIDTH}
          paneTitle={<FormattedMessage id="ui-inn-reach.shipped-items.title.receive-shipped-items" />}
        >
          <NavigationMenu
            history={history}
            location={location}
            value={getReceiveShippedItemUrl()}
          />
        </Pane>
        <Pane
          defaultWidth={FILL_PANE_WIDTH}
          paneTitle={<FormattedMessage id="ui-inn-reach.shipped-items.title.scan-items" />}
        >
          <ItemForm
            isLoading={isLoading}
            intl={intl}
            formRef={itemFormRef}
            barcodeRef={barcodeRef}
            onSubmit={onSubmit}
          />
          {isLoading &&
            <Icon icon={ICONS.SPINNER_ELLIPSIS} />
          }
          <ListCheckInItems
            scannedItems={scannedItems}
            stripes={stripes}
            intl={intl}
            onGetSlipTemplate={onGetSlipTemplate}
          />
        </Pane>
      </Paneset>
      <PaneFooter
        innerClassName={css.footerContent}
        renderEnd={
          <Button
            marginBottom0
            buttonStyle="primary mega"
            disabled={isEmpty(scannedItems)}
            onClick={onSessionEnd}
          >
            <FormattedMessage id="ui-inn-reach.shipped-items.button.end-session" />
          </Button>
        }
      />
    </div>
  );
};

export default CheckIn;
