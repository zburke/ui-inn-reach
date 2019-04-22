import React from 'react';
import { FormattedMessage } from 'react-intl';

export default class NewAppGreeting extends React.Component {
  render() {
    return (
      <div>
        <h2 data-test-application-greeting>
          <FormattedMessage id="__uiAppName__.new-app.greeting" />
        </h2>
        <FormattedMessage id="__uiAppName__.new-app.message" />
      </div>
    );
  }
}
