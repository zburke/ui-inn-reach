import React from 'react';
import {
  Button,
  PaneFooter,
  Tooltip,
} from '@folio/stripes-components';
import { FormattedMessage } from 'react-intl';
import {
  CONTRIBUTION_STATUSES,
  ITEM_TYPE_MAPPING_STATUSES,
  LOCATIONS_MAPPING_STATUSES,
  MANAGE_CONTRIBUTION_FIELDS,
} from '../../../../../constants';

const {
  STATUS,
  ITEM_TYPE_MAPPING_STATUS,
  LOCATIONS_MAPPING_STATUS,
} = MANAGE_CONTRIBUTION_FIELDS;

const {
  NOT_STARTED,
  CANCELLED,
  IN_PROGRESS,
} = CONTRIBUTION_STATUSES;

const Footer = ({
  currentContribution,
  onInitiateContribution,
  onCancelContribution,
}) => {
  const canInitiateContribution = (
    (currentContribution[STATUS] === NOT_STARTED || currentContribution[STATUS] === CANCELLED) &&
    currentContribution[ITEM_TYPE_MAPPING_STATUS] === ITEM_TYPE_MAPPING_STATUSES.VALID &&
    currentContribution[LOCATIONS_MAPPING_STATUS] === LOCATIONS_MAPPING_STATUSES.VALID
  );

  const initiateContributionBtn = () => (
    <Button
      marginBottom0
      id="clickable-initiate-contribution"
      buttonStyle="primary mega"
      disabled={!canInitiateContribution}
      onClick={onInitiateContribution}
    >
      <FormattedMessage id="ui-inn-reach.settings.manage-contribution.button.initiate-contribution" />
    </Button>
  );
  const tooltipedInitiateContributionBtn = () => (
    !canInitiateContribution ? (
      <Tooltip
        id="save-button-tooltip"
        name="tooltip-text"
        text={<FormattedMessage id="ui-inn-reach.settings.manage-contribution.tooltip.check-mappings" />}
        placement="bottom-start"
      >
        {({ ref, ariaIds }) => (
          <div
            ref={ref}
            aria-labelledby={ariaIds.text}
          >
            {initiateContributionBtn()}
          </div>
        )}
      </Tooltip>
    ) : (
      initiateContributionBtn()
    )
  );

  const cancelContributionBtn = () => (
    <Button
      marginBottom0
      buttonStyle="default mega"
      onClick={onCancelContribution}
    >
      <FormattedMessage id="ui-inn-reach.settings.manage-contribution.button.cancel-contribution" />
    </Button>
  );

  const pauseContributionBtn = () => (
    <Button
      marginBottom0
      buttonStyle="primary mega"
    >
      <FormattedMessage id="ui-inn-reach.settings.manage-contribution.button.pause-contribution" />
    </Button>
  );

  switch (currentContribution[STATUS]) {
    case NOT_STARTED:
      return <PaneFooter renderEnd={tooltipedInitiateContributionBtn()} />;
    case IN_PROGRESS:
      return (
        <PaneFooter
          renderStart={cancelContributionBtn()}
          renderEnd={pauseContributionBtn()}
        />
      );
    case CANCELLED:
      return <PaneFooter renderEnd={tooltipedInitiateContributionBtn()} />;
    default:
      return null;
  }
};

export default Footer;
