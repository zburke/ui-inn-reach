import React, { useRef } from 'react';
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
import css from '../../ManageContributionView.css';

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
  const initiateContributionRef = useRef(null);

  const canInitiateContribution = (
    (currentContribution[STATUS] === NOT_STARTED || currentContribution[STATUS] === CANCELLED) &&
    currentContribution[ITEM_TYPE_MAPPING_STATUS] === ITEM_TYPE_MAPPING_STATUSES.VALID &&
    currentContribution[LOCATIONS_MAPPING_STATUS] === LOCATIONS_MAPPING_STATUSES.VALID
  );
  const ariaLabelledby = !canInitiateContribution ? { 'aria-labelledby': 'tooltip-text' } : {};

  const initiateContributionBtn = () => (
    <>
      <div
        ref={initiateContributionRef}
        className={css.tooltipWrapper}
        {...ariaLabelledby}
      >
        <Button
          marginBottom0
          data-testid="initiate-contribution"
          id="clickable-initiate-contribution"
          buttonStyle="primary mega"
          disabled={!canInitiateContribution}
          onClick={onInitiateContribution}
        >
          <FormattedMessage id="ui-inn-reach.settings.manage-contribution.button.initiate-contribution" />
        </Button>
      </div>
      {!canInitiateContribution &&
      <Tooltip
        id="save-button-tooltip"
        name="tooltip-text"
        text={<FormattedMessage id="ui-inn-reach.settings.manage-contribution.tooltip.check-mappings" />}
        triggerRef={initiateContributionRef}
      />
      }

    </>
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
      return <PaneFooter renderEnd={initiateContributionBtn()} />;
    case IN_PROGRESS:
      return (
        <PaneFooter
          renderStart={cancelContributionBtn()}
          renderEnd={pauseContributionBtn()}
        />
      );
    case CANCELLED:
      return <PaneFooter renderEnd={initiateContributionBtn()} />;
    default:
      return null;
  }
};

export default Footer;
