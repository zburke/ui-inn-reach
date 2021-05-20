import React from 'react';
import PropTypes from 'prop-types';

import { IntlConsumer } from '@folio/stripes/core';
import {
  TextField,
  MultiSelection,
  Row,
  Col,
  Label,
} from '@folio/stripes-components';

import RepeatableField from '../RepeatableField';

import css from './LocalAgencyFields.css';

const LocalAgencyFields = ({
  librariesTypes,
  canAdd,
  canEdit,
  canDelete,
}) => {
  const newItemTemplate = {
    localAgency: '',
    FOLIOLibraries: '',
  };
  const librariesTypeOptions = librariesTypes.map(it => ({
    label: it.name,
    value: it.id,
  }));

  return (
    <IntlConsumer>
      {intl => (
        <Row className={css.localAgencyContainer}>
          <Col xs={12}>
            <Row>
              <Col xs={11}>
                <Row>
                  <Col
                    xs={4}
                    className={css.firstLabelContainer}
                  >
                    <Label
                      required
                      htmlFor="localAgency"
                    >
                      {intl.formatMessage({ id: 'ui-inn-reach.localAgency' })}
                    </Label>
                  </Col>
                  <Col
                    xs={8}
                    className={css.secondLabelContainer}
                  >
                    <Label
                      required
                      htmlFor="FOLIOLibraries-input"
                    >
                      {intl.formatMessage({ id: 'ui-inn-reach.FOLIOLibraries' })}
                    </Label>
                  </Col>
                </Row>
              </Col>
              <span className={css.underline} />
            </Row>
            <RepeatableField
              addDefaultItem
              name="localAgencies"
              template={[
                {
                  id: 'localAgency',
                  name: 'localAgency',
                  component: TextField,
                  required: true,
                  disabled: !canEdit,
                  columnSize: { xs: 4 }
                },
                {
                  id: 'FOLIOLibraries',
                  name: 'FOLIOLibraries',
                  component: MultiSelection,
                  dataOptions: librariesTypeOptions,
                  required: true,
                  disabled: !canEdit,
                  columnSize: { xs: 8 },
                }
              ]}
              newItemTemplate={newItemTemplate}
              canAdd={canAdd}
              canDelete={canDelete}
              showAddNewField={false}
              fieldsetClass={css.RFFieldset}
              layoutClass={css.layoutClass}
              legendClass={css.RFLegend}
              buttonsContainerClass={css.buttonsContainerClass}
              fieldsContainerClass={css.fieldsContainerClass}
            />
          </Col>
        </Row>
      )}
    </IntlConsumer>
  );
};

LocalAgencyFields.propTypes = {
  canAdd: PropTypes.bool,
  canDelete: PropTypes.bool,
  canEdit: PropTypes.bool,
  librariesTypes: PropTypes.arrayOf(PropTypes.object),
};
LocalAgencyFields.defaultProps = {
  canAdd: true,
  canDelete: true,
  canEdit: true,
  librariesTypes: [],
};

export default LocalAgencyFields;
