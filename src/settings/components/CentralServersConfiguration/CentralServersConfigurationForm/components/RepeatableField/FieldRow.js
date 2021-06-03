import React, {
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Layout,
  Row,
  Col,
  omitProps,
  SRStatus,
  IconButton,
} from '@folio/stripes-components';

import css from './RepeatableField.css';

const FieldRow = ({
  fields,
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

  const handleRemoveAction = (action) => {
    const {
      item,
    } = action;
    let contextualSpeech;

    if (typeof item === 'string') {
      contextualSpeech = action.item;
    }

    srstatus.current.sendMessage(
      `${label} ${contextualSpeech} has been removed. ${fields.length} ${label} total`
    );
  };

  const legend = (
    <legend
      className={legendClass || css.RFLegend}
    >
      {label}
    </legend>
  );

  const handleAdd = () => {
    const message = `added new ${label} field. ${fields.length} ${label} total`;

    srstatus.current.sendMessage(message);
    onAddField(fields);
  };

  const handleRemove = (index, item) => {
    const action = {
      item,
      index,
    };

    handleRemoveAction(action);
    fields.remove(index);
  };

  const refIfLastRow = (ref, index) => {
    if (index === fields.length - 1) {
      lastRowRef(ref);
    }
  };

  const renderControl = (fieldsData, field, fieldIndex, templ, templateIndex) => {
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
        id={field.id || uniqueId(field)}
        templateIndex={templateIndex}
        {...labelProps}
        data-key={fieldIndex}
        fields={fieldsData}
        {...rest}
      />
    );
  };

  return (
    <div
      data-testid="field-row-container"
      ref={containerRef}
    >
      <SRStatus ref={srstatus} />
      <fieldset className={fieldsetClass || css.RFFieldset}>
        {legend}
        {fields.map((f, fieldIndex) => (
          <div
            data-testid="repeatable-field-row"
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
                        onClick={handleAdd}
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
              onClick={handleAdd}
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
