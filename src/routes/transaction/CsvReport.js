import {
  exportToCsv,
} from '@folio/stripes-components';

import {
  NO_ITEMS_FOUND,
} from '../../constants';

class CsvReport {
  constructor(options) {
    const {
      intl: {
        formatMessage,
        formatTime,
      },
    } = options;

    this.formatMessage = formatMessage;
    this.formatTime = formatTime;
  }

  setUp(params, reportColumns) {
    this.params = params;

    this.columnsMap = reportColumns.map(value => ({
      label: this.formatMessage({ id: `ui-inn-reach.reports.${value}` }),
      value,
    }));
  }

  async fetchData(mutator) {
    const { GET, reset } = mutator;
    const params = this.params;
    const limit = 1000;
    const data = [];

    let offset = 0;
    let hasData = true;

    while (hasData) {
      try {
        reset();
        const { transactions } = await GET({ params: { ...params, limit, offset } });

        hasData = transactions.length;
        offset += limit;
        if (hasData) {
          data.push(...transactions);
          hasData = false;
        }
      } catch (err) {
        hasData = false;
      }
    }

    return data;
  }

  async generate(mutator, getLoansToCsv, params, reportColumns) {
    this.setUp(params, reportColumns);
    const loans = await this.fetchData(mutator.transactionRecords);

    if (loans.length !== 0) {
      const loansToCsv = await getLoansToCsv(loans);

      this.toCSV(loansToCsv);
    } else { throw new Error(NO_ITEMS_FOUND); }
  }

  toCSV(records) {
    const onlyFields = this.columnsMap;

    exportToCsv(records, { onlyFields });
  }
}

export default CsvReport;
