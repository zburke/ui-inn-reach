import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import { FieldArray } from 'react-final-form-arrays';
import FieldRow from './FieldRow';

const RepeatableField = ({
  template,
  newItemTemplate,
  name,
  label,
  addDefaultItem,
  addLabel,
  addButtonId,
  canAdd,
  canEdit,
  canDelete,
  showAddNewField,
  fieldsetClass,
  layoutClass,
  legendClass,
  buttonsContainerClass,
  fieldsContainerClass,
}) => {
  const lastRow = useRef();

  let added = false;

  if (added && lastRow.current) {
    const firstInput = lastRow.current.querySelector('input, select');

    if (firstInput) {
      firstInput.focus();
      added = false;
    }
  }

  const buildComponentFromTemplate = ({
    templateIndex,
    input,
    meta,
    ...rest
  }) => {
    const Component = template[templateIndex].component;

    return (
      <Component
        input={input}
        meta={meta}
        {...rest}
      />
    );
  };

  const addDefaultField = (fields) => {
    if (newItemTemplate) {
      fields.push(cloneDeep(newItemTemplate));
    } else {
      fields.push();
    }
  };

  const handleAddField = (fields) => {
    if (newItemTemplate) {
      fields.push(cloneDeep(newItemTemplate));
    } else {
      fields.push();
    }
    added = true;
  };

  return (
    <FieldArray
      name={name}
      component={FieldRow}
      template={template}
      label={label}
      newItemTemplate={newItemTemplate}
      addDefaultItem={addDefaultItem}
      addLabel={addLabel}
      addButtonId={addButtonId}
      canAdd={canAdd}
      canEdit={canEdit}
      canDelete={canDelete}
      lastRowRef={ref => { lastRow.current = ref; }}
      showAddNewField={showAddNewField}
      fieldsetClass={fieldsetClass}
      layoutClass={layoutClass}
      legendClass={legendClass}
      buttonsContainerClass={buttonsContainerClass}
      fieldsContainerClass={fieldsContainerClass}
      formatter={buildComponentFromTemplate}
      addDefault={addDefaultField}
      onAddField={handleAddField}
    />
  );
};

RepeatableField.propTypes = {
  name: PropTypes.string.isRequired,
  addButtonId: PropTypes.string,
  addDefaultItem: PropTypes.bool,
  addLabel: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  buttonsContainerClass: PropTypes.string,
  canAdd: PropTypes.bool,
  canDelete: PropTypes.bool,
  canEdit: PropTypes.bool,
  fieldsContainerClass: PropTypes.string,
  fieldsetClass: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  layoutClass: PropTypes.string,
  legendClass: PropTypes.string,
  newItemTemplate: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  showAddNewField: PropTypes.bool,
  template: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object)]),
};

RepeatableField.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default RepeatableField;
