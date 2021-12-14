import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  Select,
} from '@folio/stripes/components';

import {
  getReceiveShippedItemUrl,
  getTransactionListUrl,
} from '../../../constants';
import css from './NavigationMenu.css';

const NavigationMenu = ({
  history,
  location,
  value,
  dataOptions,
  separator,
}) => {
  const intl = useIntl();

  const defaultOptions = [
    {
      label: intl.formatMessage({ id: 'ui-inn-reach.title.list.transactions' }),
      value: getTransactionListUrl(),
    },
    {
      label: intl.formatMessage({ id: 'ui-inn-reach.shipped-items.title.receive-shipped-items' }),
      value: getReceiveShippedItemUrl(),
    },
  ];

  const handleChangeMenu = (event) => {
    const pathname = event.target.value;
    const destination = {
      pathname,
      state: location.state,
    };

    if (pathname === getTransactionListUrl()) {
      destination.search = location.state;
    } else {
      destination.state = location.search;
    }

    history.push(destination);
  };

  return (
    <>
      <Select
        value={value}
        dataOptions={dataOptions || defaultOptions}
        onChange={handleChangeMenu}
      />
      {separator &&
        <div
          className={css.separator}
          data-testid="separator"
        />
      }
    </>
  );
};

NavigationMenu.defaultProps = {
  value: getTransactionListUrl(),
};

NavigationMenu.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  location: PropTypes.object.isRequired,
  dataOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })),
  separator: PropTypes.bool,
  value: PropTypes.string,
};

export default NavigationMenu;
