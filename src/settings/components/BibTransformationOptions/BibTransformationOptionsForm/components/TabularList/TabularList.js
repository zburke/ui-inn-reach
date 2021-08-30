import React, {
  useRef,
} from 'react';
import classNames from 'classnames';
import {
  isEqual,
} from 'lodash';
import {
  Checkbox,
  Col,
  Row,
  TextArea,
  Select,
  SRStatus,
} from '@folio/stripes-components';
import {
  Field,
} from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  FieldArray,
} from 'react-final-form-arrays';
import {
  BIB_TRANSFORMATION_FIELDS,
  NEW_ROW_VALUES,
  TEXTAREA_ROWS_NUMBER,
} from '../../../../../../constants';
import {
  validateIdentifierType,
} from './utils';
import AddAndDeleteButtons from './components/AddAndDeleteButtons';
import TabularListTitles from './components/TabularListTitles';
import SwapButtons from './components/SwapButtons';
import css from './TabularList.css';

const {
  MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS,
  RESOURCE_IDENTIFIER_TYPE_ID,
  STRIP_PREFIX,
  IGNORE_PREFIXES,
} = BIB_TRANSFORMATION_FIELDS;

const TabularList = ({
  identifierTypeOptions,
  mutators,
}) => {
  const {
    addRowAfterCurrent,
    swapRows,
  } = mutators;
  const { formatMessage } = useIntl();
  const srsRef = useRef();

  const handleAddRow = (index, fields) => {
    addRowAfterCurrent(index, NEW_ROW_VALUES);

    srsRef.current.sendMessage(
      <FormattedMessage
        id="ui-inn-reach.action.add-new-field"
        values={{
          label: formatMessage({ id: 'ui-inn-reach.settings.bib-transformation.action.add-new-field' }),
          fieldsLength: fields.length + 1,
        }}
      />
    );
  };

  const handleDeleteRow = (index, fields) => {
    fields.remove(index);

    srsRef.current.sendMessage(
      <FormattedMessage
        id="ui-inn-reach.action.remove-fields"
        values={{
          label: formatMessage({ id: 'ui-inn-reach.settings.bib-transformation.action.remove-fields' }),
          fieldsLength: fields.length - 1,
          index: index + 1,
        }}
      />
    );
  };

  const handleSwapRows = (from, to) => {
    swapRows(from, to);

    srsRef.current.sendMessage(
      <FormattedMessage
        id="ui-inn-reach.action.swap"
        values={{
          label: formatMessage({ id: 'ui-inn-reach.settings.bib-transformation.action.swap' }),
          from: from + 1,
          to: to + 1,
        }}
      />
    );
  };

  return (
    <Col
      sm={12}
      data-testid={MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS}
      className={css.tabularContainer}
    >
      <SRStatus ref={srsRef} />
      <TabularListTitles />
      <FieldArray
        isEqual={isEqual}
        name={MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS}
      >
        {({ fields }) => fields.map((name, index) => {
          const isLastRow = index === fields.length - 1;
          const isDownButtonVisible = (index === 0 && fields.length > 1) || (!!index && !isLastRow);
          const isDeleteButtonDisabled = fields.length === 1;

          return (
            <Row
              key={index}
              className={css.tabularRow}
            >
              <SwapButtons
                isUpButtonVisible={!!index}
                isDownButtonVisible={isDownButtonVisible}
                index={index}
                onSwapRows={handleSwapRows}
              />
              <Col
                sm={3}
                className={css.tabularCol}
              >
                <Field
                  marginBottom0
                  required
                  id={`${name}.${RESOURCE_IDENTIFIER_TYPE_ID}-${index}`}
                  name={`${name}.${RESOURCE_IDENTIFIER_TYPE_ID}`}
                  aria-label={formatMessage({ id: 'ui-inn-reach.settings.bib-transformation.field.identifier-type' })}
                  component={Select}
                  dataOptions={identifierTypeOptions}
                  placeholder={formatMessage({ id: 'ui-inn-reach.settings.bib-transformation.placeholder.identifier-type' })}
                  selectClass={css.selectControl}
                  validate={validateIdentifierType}
                />
              </Col>
              <Col className={classNames(css.tabularCol, css.customColSmWidth)}>
                <Field
                  id={`${name}.${STRIP_PREFIX}-${index}`}
                  name={`${name}.${STRIP_PREFIX}`}
                  component={Checkbox}
                  aria-label={formatMessage({ id: 'ui-inn-reach.settings.bib-transformation.field.strip-prefix' })}
                  type="checkbox"
                />
              </Col>
              <Col className={classNames(css.tabularCol, css.customColMdWidth)}>
                <Field
                  id={`${name}.${IGNORE_PREFIXES}-${index}`}
                  name={`${name}.${IGNORE_PREFIXES}`}
                  component={TextArea}
                  rows={TEXTAREA_ROWS_NUMBER}
                  type="text"
                  aria-label={formatMessage({ id: 'ui-inn-reach.settings.bib-transformation.field.ignore-prefixes' })}
                  placeholder={formatMessage({ id: 'ui-inn-reach.settings.bib-transformation.placeholder.ignore-prefixes' })}
                />
              </Col>
              <AddAndDeleteButtons
                isDeleteButtonDisabled={isDeleteButtonDisabled}
                index={index}
                onAdd={() => handleAddRow(index, fields)}
                onDelete={() => handleDeleteRow(index, fields)}
              />
            </Row>
          );
        })}
      </FieldArray>
    </Col>
  );
};

export default TabularList;
