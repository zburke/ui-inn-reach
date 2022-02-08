import React, {
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  Row,
  KeyValue,
  NoValue,
  MultiColumnList,
} from '@folio/stripes-components';
import { ViewMetaData } from '@folio/stripes-smart-components';

import {
  GENERAL_ACCORDION_NAME,
  METADATA_ACCORDION_NAME,
  CENTRAL_SERVER_CONFIGURATION_FIELDS,
  LOCAL_AGENCIES_FIELDS,
} from '../../../../../../constants';
import { CentralServersConfigurationContext } from '../../../../../../contexts';

const getFormattedFolioLibraries = (folioLibraryIds, folioLibraries) => {
  // eslint-disable-next-line no-param-reassign
  const folioLibraryCodesArr = folioLibraryIds.map(id => folioLibraries.find((lib) => lib.id === id).code);

  return folioLibraryCodesArr.length
    ? folioLibraryCodesArr.join(', ')
    : <NoValue />;
};

const GeneralInformation = ({
  centralServer,
}) => {
  const {
    loanTypes,
    folioLibraries,
  } = useContext(CentralServersConfigurationContext);

  const getLoanTypeName = (id) => {
    const loanType = loanTypes.find((type) => type.id === id);

    return loanType.name;
  };

  const visibleColumns = [
    LOCAL_AGENCIES_FIELDS.CODE,
    LOCAL_AGENCIES_FIELDS.FOLIO_LIBRARY_IDS,
  ];

  const columnMapping = {
    [LOCAL_AGENCIES_FIELDS.CODE]: <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.local-agency.field.code" />,
    [LOCAL_AGENCIES_FIELDS.FOLIO_LIBRARY_IDS]: <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.local-agency.field.libraries" />,
  };

  const resultsFormatter = {
    [LOCAL_AGENCIES_FIELDS.CODE]: (data) => (data[LOCAL_AGENCIES_FIELDS.CODE] || <NoValue />),
    [LOCAL_AGENCIES_FIELDS.FOLIO_LIBRARY_IDS]: (data) => getFormattedFolioLibraries(data.folioLibraryIds, folioLibraries),
  };

  return (
    <Accordion
      id={GENERAL_ACCORDION_NAME}
      label={<FormattedMessage id="ui-inn-reach.settings.central-server-configuration.view.accordion.generalInformation.title" />}
    >
      <Row>
        <Col sm={12}>
          <ViewMetaData
            id={METADATA_ACCORDION_NAME}
            metadata={centralServer[CENTRAL_SERVER_CONFIGURATION_FIELDS.METADATA]}
          />
        </Col>
      </Row>
      <Row>
        <Col xs>
          <KeyValue
            data-testid="central-server-configuration-view-fields-name"
            label={<FormattedMessage id="ui-inn-reach.settings.central-server-configuration.view.field.name" />}
            value={centralServer[CENTRAL_SERVER_CONFIGURATION_FIELDS.NAME]}
          />
        </Col>
      </Row>
      <Row>
        <Col xs>
          <KeyValue
            data-testid="central-server-configuration-view-fields-description"
            label={<FormattedMessage id="ui-inn-reach.settings.central-server-configuration.view.field.description" />}
            value={centralServer[CENTRAL_SERVER_CONFIGURATION_FIELDS.DESCRIPTION] || <NoValue />}
          />
        </Col>
      </Row>
      <Row>
        <Col xs>
          <KeyValue
            data-testid="central-server-configuration-view-fields-local-server-code"
            label={<FormattedMessage id="ui-inn-reach.settings.central-server-configuration.view.field.local-server-code" />}
            value={centralServer[CENTRAL_SERVER_CONFIGURATION_FIELDS.LOCAL_SERVER_CODE] || <NoValue />}
          />
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          <MultiColumnList
            columnMapping={columnMapping}
            contentData={centralServer[CENTRAL_SERVER_CONFIGURATION_FIELDS.LOCAL_AGENCIES]}
            formatter={resultsFormatter}
            id="centralCerverLocalAgencies"
            visibleColumns={visibleColumns}
          />
        </Col>
      </Row>
      <Row>
        <Col xs>
          <KeyValue
            data-testid="central-server-configuration-view-fields-loan-type"
            label={<FormattedMessage id="ui-inn-reach.settings.central-server-configuration.view.field.loan-type" />}
            value={getLoanTypeName(centralServer[CENTRAL_SERVER_CONFIGURATION_FIELDS.LOAN_TYPE_ID]) || <NoValue />}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

GeneralInformation.propTypes = {
  centralServer: PropTypes.object.isRequired,
};

export default GeneralInformation;
