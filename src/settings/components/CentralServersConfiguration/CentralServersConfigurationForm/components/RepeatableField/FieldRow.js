import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Layout,
  Icon,
  Row,
  Col,
  omitProps,
  SRStatus,
  IconButton,
} from '@folio/stripes-components';

import css from './RepeatableField.css';

const FieldRow = ({
  fields,
  addDefaultItem,
  addDefault,
  addButtonId: addBtnId,
  label,
  showAddNewField,
  lastRowRef,
  formatter,
  addLabel,
  canAdd,
  canDelete,
  containerRef,
  onAddField,
  template,
  fieldsetClass,
  layoutClass,
  legendClass,
  fieldsContainerClass,
  buttonsContainerClass,
}) => {
  const srstatus = useRef();
  const addButtonId = addBtnId || uniqueId(`${label}AddButton`);
  let action;

  if (fields.length === 0 && addDefaultItem) {
    setTimeout(() => {
      addDefault(fields);
    }, 5);
    addDefault(fields);
  }

  if (action) {
    if (action.type === 'add') {
      srstatus.current.sendMessage(
        `added new ${label} field. ${fields.length} ${label} total`
      );
      action = null;
    }

    if (action.type === 'remove') {
      const {
        item,
      } = action;
      let contextualSpeech;

      if (typeof item === 'string') {
        contextualSpeech = action.item;
      } else if (typeof item === 'object') {
        const valueArray = [];

        for (const key in item) {
          if (typeof item[key] === 'string' && item[key].length < 25) {
            valueArray.push(item[key]);
          }
        }

        if (valueArray.length > 0) {
          contextualSpeech = valueArray.join(' ');
        } else {
          contextualSpeech = action.index;
        }
      }

      srstatus.current.sendMessage(
        `${label} ${contextualSpeech} has been removed. ${fields.length} ${label} total`
      );

      action = null;

      if (showAddNewField) {
        document.getElementById(addButtonId).focus();
      }
    }
  }

  const legend = (
    <legend
      className={legendClass || css.RFLegend}
    >
      {label}
    </legend>
  );

  const handleButtonClick = () => {
    onAddField(fields);
  };

  if (fields.length === 0 && !addDefaultItem) {
    return (
      <div ref={containerRef}>
        <SRStatus ref={srstatus} />
        <fieldset className={css.RFFieldset}>
          {legend}
          <Button
            style={{ marginBottom: '12px' }}
            id={addButtonId}
            disabled={!canAdd}
            onClick={handleButtonClick}
          >
            {addLabel || (
              <Icon icon="plus-sign">
                <FormattedMessage
                  id="ui-inn-reach.addLabel"
                  values={{ label }}
                />
              </Icon>
            )}
          </Button>
        </fieldset>
      </div>
    );
  }

  const handleRemove = (index, item) => {
    action = {
      type: 'remove',
      item,
      index,
    };
    fields.remove(index);
  };

  const refIfLastRow = (ref, index) => {
    if (index === fields.length - 1) {
      lastRowRef(ref);
    }
  };

  const renderControl = (fieldsData, field, fieldIndex, templ, templateIndex) => {
    if (templ.render) {
      return templ.render({
        fields: fieldsData,
        field,
        fieldIndex,
        templateIndex,
      });
    }

    const {
      name,
      label: templateLabel,
      ...rest
    } = omitProps(templ, ['component', 'render', 'columnSize']);
    const labelProps = {};

    if (fieldIndex === 0) {
      labelProps.label = templateLabel;
    } else {
      labelProps['aria-label'] = `${templateLabel} ${fieldIndex}`;
    }

    return (
      <Field
        fullWidth
        name={name ? `${fields.name}[${fieldIndex}].${name}` : `${fields.name}[${fieldIndex}]`}
        component={formatter}
        templateIndex={templateIndex}
        id={uniqueId(field)}
        {...labelProps}
        data-key={fieldIndex}
        fields={fieldsData}
        {...rest}
      />
    );
  };

  return (
    <div ref={containerRef}>
      <SRStatus ref={srstatus} />
      <fieldset className={fieldsetClass || css.RFFieldset}>
        {legend}
        {fields.map((f, fieldIndex) => (
          <div
            data-test-repeater-field-row
            key={`${label}-${fieldIndex}`}
            style={{ width: '100%' }}
            ref={ref => { refIfLastRow(ref, fieldIndex); }}
          >
            <Row>
              <Col xs={11}>
                <Row>
                  {template.map((t, i) => {
                    const {
                      columnSize,
                    } = t;
                    const colSizes = typeof columnSize === 'object'
                      ? columnSize
                      : { xs: true };

                    return (
                      <Col
                        {...colSizes}
                        key={`field-${i}`}
                        className={fieldsContainerClass}
                      >
                        {renderControl(fields, f, fieldIndex, t, i)}
                      </Col>
                    );
                  })}
                </Row>
              </Col>
              <Col
                xs={1}
                className={buttonsContainerClass}
              >
                <Layout className={layoutClass || (fieldIndex === 0 ? 'marginTopLabelSpacer' : '')}>
                  <FormattedMessage
                    id="stripes-components.addNewField"
                    values={{ item: label }}
                  >
                    {([ariaLabel]) => (
                      <IconButton
                        icon="plus-sign"
                        aria-label={ariaLabel}
                        disabled={!canAdd}
                        onClick={handleButtonClick}
                      />
                    )}
                  </FormattedMessage>
                  <FormattedMessage
                    id="stripes-components.removeFields"
                    values={{ item: label, num: fieldIndex + 1 }}
                  >
                    {([ariaLabel]) => (
                      <IconButton
                        icon="trash"
                        aria-label={ariaLabel}
                        disabled={!canDelete || (!showAddNewField && fields.length === 1)}
                        onClick={() => { handleRemove(fieldIndex, f); }}
                      />
                    )}
                  </FormattedMessage>
                </Layout>
              </Col>
            </Row>
            {showAddNewField && fieldIndex === fields.length - 1 &&
            <Button
              id={addButtonId}
              disabled={!canAdd}
              onClick={handleButtonClick}
            >
              {addLabel || (
                <FormattedMessage
                  id="stripes-components.addNewField"
                  values={{ item: label }}
                />)}
            </Button>
            }
          </div>
        ))}
      </fieldset>
    </div>
  );
};

FieldRow.propTypes = {
  addButtonId: PropTypes.string,
  addDefault: PropTypes.func,
  addDefaultItem: PropTypes.bool,
  addLabel: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  buttonsContainerClass: PropTypes.string,
  canAdd: PropTypes.bool,
  canDelete: PropTypes.bool,
  canEdit: PropTypes.bool,
  containerRef: PropTypes.func,
  fields: PropTypes.object,
  fieldsContainerClass: PropTypes.string,
  fieldsetClass: PropTypes.string,
  formatter: PropTypes.func,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.node]),
  lastRowRef: PropTypes.func,
  layoutClass: PropTypes.string,
  legendClass: PropTypes.string,
  newItemTemplate: PropTypes.object,
  showAddNewField: PropTypes.bool,
  template: PropTypes.arrayOf(PropTypes.object),
  onAddField: PropTypes.func,
};

FieldRow.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default FieldRow;
