import React, {
  useRef,
} from 'react';
import classNames from 'classnames';
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
  BIB_TRANSFORMATION_FIELDS,
  NEW_ROW_VALUES,
  TEXTAREA_ROWS_NUMBER,
} from '../../../../../../constants';
import {
  AddAndDeleteButtons,
  TableStyleList,
} from '../../../../common';
import TabularListTitles from './components/TabularListTitles';
import SwapButtons from './components/SwapButtons';
import {
  required,
} from '../../../../../../utils';
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
    <>
      <SRStatus ref={srsRef} />
      <TableStyleList
        fieldArrayName={MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS}
        customTitles={<TabularListTitles />}
        rootClassName={css.tabularContainer}
      >
        {({ fields }) => fields.map((name, index) => {
          const isLastRow = index === fields.length - 1;
          const isDownButtonVisible = (index === 0 && fields.length > 1) || (!!index && !isLastRow);

          return (
            <Row
              key={index}
              className={classNames(css.tabularRow, index % 2 ? css.tabularRowOdd : css.tabularRowEven)}
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
                  validate={required}
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
              <Col className={classNames(css.tabularCol, css.customColMdWidth, css.textareaContainer)}>
                <Field
                  id={`${name}.${IGNORE_PREFIXES}-${index}`}
                  name={`${name}.${IGNORE_PREFIXES}`}
                  component={TextArea}
                  rows={TEXTAREA_ROWS_NUMBER}
                  type="text"
                  parse={v => v}
                  aria-label={formatMessage({ id: 'ui-inn-reach.settings.bib-transformation.field.ignore-prefixes' })}
                  placeholder={formatMessage({ id: 'ui-inn-reach.settings.bib-transformation.placeholder.ignore-prefixes' })}
                />
              </Col>
              <AddAndDeleteButtons
                index={index}
                fields={fields}
                addRowAfterCurrent={addRowAfterCurrent}
                newRowTemplate={NEW_ROW_VALUES}
                srsRef={srsRef}
              />
            </Row>
          );
        })}
      </TableStyleList>
    </>
  );
};

export default TabularList;
