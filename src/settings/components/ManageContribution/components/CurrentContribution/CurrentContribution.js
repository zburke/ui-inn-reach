import React from 'react';
import PropTypes from 'prop-types';
import {
  ContributionInfo,
  RecordsInfo,
} from './components';

const CurrentContribution = ({
  currentContribution,
}) => {
  return (
    <>
      <ContributionInfo
        currentContribution={currentContribution}
      />
      <RecordsInfo
        currentContribution={currentContribution}
      />
    </>
  );
};

CurrentContribution.propTypes = {
  currentContribution: PropTypes.object.isRequired,
};
export default CurrentContribution;
