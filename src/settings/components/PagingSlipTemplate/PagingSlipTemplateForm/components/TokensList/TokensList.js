import {
  injectIntl,
} from 'react-intl';
import PropTypes from 'prop-types';

import {
  Row,
  Col,
} from '@folio/stripes-components';
import {
  TokensSection,
} from '@folio/stripes-template-editor';

import {
  TOKEN_NAMES,
} from '../../../../../../constants';

const {
  INN_REACH_PATRON,
  INN_REACH_SERVER,
  INN_REACH_AGENCY,
  INN_REACH_PICKUP_LOCATIONS,
  ITEM,
  EFFECTIVE_LOCATION,
  STAFF_SLIP,
} = TOKEN_NAMES;

const TokensList = ({
  tokens,
  intl,
  onSectionInit,
  onTokenSelect,
}) => {
  const { formatMessage } = intl;

  return (
    <Row>
      <Col xs={6}>
        <TokensSection
          section={INN_REACH_PATRON}
          header={formatMessage({ id: 'ui-inn-reach.settings.paging-slip-template.token-header.inn-reach-patron' })}
          tokens={tokens[INN_REACH_PATRON]}
          onSectionInit={onSectionInit}
          onTokenSelect={onTokenSelect}
        />
        <TokensSection
          section={INN_REACH_SERVER}
          header={formatMessage({ id: 'ui-inn-reach.settings.paging-slip-template.token-header.inn-reach-server' })}
          tokens={tokens[INN_REACH_SERVER]}
          onSectionInit={onSectionInit}
          onTokenSelect={onTokenSelect}
        />
        <TokensSection
          section={INN_REACH_AGENCY}
          header={formatMessage({ id: 'ui-inn-reach.settings.paging-slip-template.token-header.inn-reach-agency' })}
          tokens={tokens[INN_REACH_AGENCY]}
          onSectionInit={onSectionInit}
          onTokenSelect={onTokenSelect}
        />
        <TokensSection
          section={INN_REACH_PICKUP_LOCATIONS}
          header={formatMessage({ id: 'ui-inn-reach.settings.paging-slip-template.token-header.inn-reach-pickup-location' })}
          tokens={tokens[INN_REACH_PICKUP_LOCATIONS]}
          onSectionInit={onSectionInit}
          onTokenSelect={onTokenSelect}
        />
      </Col>
      <Col xs={6}>
        <TokensSection
          section={ITEM}
          header={formatMessage({ id: 'ui-inn-reach.settings.paging-slip-template.token-header.item' })}
          tokens={tokens[ITEM]}
          onSectionInit={onSectionInit}
          onTokenSelect={onTokenSelect}
        />
        <TokensSection
          section={EFFECTIVE_LOCATION}
          header={formatMessage({ id: 'ui-inn-reach.settings.paging-slip-template.token-header.effective-location' })}
          tokens={tokens[EFFECTIVE_LOCATION]}
          onSectionInit={onSectionInit}
          onTokenSelect={onTokenSelect}
        />
        <TokensSection
          section={STAFF_SLIP}
          header={formatMessage({ id: 'ui-inn-reach.settings.paging-slip-template.token-header.staff-slip' })}
          tokens={tokens[STAFF_SLIP]}
          onSectionInit={onSectionInit}
          onTokenSelect={onTokenSelect}
        />
      </Col>
    </Row>
  );
};

TokensList.propTypes = {
  intl: PropTypes.object.isRequired,
  tokens: PropTypes.object.isRequired,
  onSectionInit: PropTypes.func.isRequired,
  onTokenSelect: PropTypes.func.isRequired,
};

export default injectIntl(TokensList);
