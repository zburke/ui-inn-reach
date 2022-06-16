import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Loading,
} from '@folio/stripes-components';

import {
  ContributionInfo,
  RecordsInfo,
} from './components';

import {
  MANAGE_CONTRIBUTION_FIELDS,
  CONTRIBUTION_STATUSES,
} from '../../../../../constants';

const {
  IN_PROGRESS,
} = CONTRIBUTION_STATUSES;

const {
  STATUS,
} = MANAGE_CONTRIBUTION_FIELDS;

const CurrentContribution = ({
  currentContribution,
  refreshCurrentContribution,
}) => {
  const isContributionInProgress = currentContribution[STATUS] === IN_PROGRESS;

  return (
    <>
      <ContributionInfo
        currentContribution={currentContribution}
      />
      <Button
        buttonStyle='default'
        onClick={refreshCurrentContribution}
      >
        <FormattedMessage id="ui-inn-reach.settings.manage-contribution.current.refresh" />
      </Button>
      <RecordsInfo
        currentContribution={currentContribution}
      />
      {isContributionInProgress && <Loading />}
    </>
  );
};

CurrentContribution.propTypes = {
  currentContribution: PropTypes.object.isRequired,
  refreshCurrentContribution: PropTypes.func.isRequired,
};
export default CurrentContribution;
