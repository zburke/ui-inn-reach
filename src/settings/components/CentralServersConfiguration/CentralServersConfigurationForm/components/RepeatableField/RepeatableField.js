import React from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import { FieldArray } from 'react-final-form-arrays';
import FieldRow from './FieldRow';

class RepeatableField extends React.Component {
  constructor(props) {
    super(props);
    this.lastRow = null;
    this._added = false;
  }

  componentDidUpdate() {
    if (this._added && this.lastRow) {
      const firstInput = this.lastRow.querySelector('input, select');

      if (firstInput) {
        firstInput.focus();
        this._added = false;
      }
    }
  }

  buildComponentFromTemplate = ({ templateIndex, input, meta, ...rest }) => {
    const {
      template,
    } = this.props;

    const Component = template[templateIndex].component;

    return (
      <Component
        input={input}
        meta={meta}
        {...rest}
      />
    );
  };

  handleAddField = (fields) => {
    const {
      newItemTemplate,
    } = this.props;

    if (newItemTemplate) {
      fields.push(cloneDeep(newItemTemplate));
      this._added = true;
    }
  }

  render() {
    const {
      name,
      template,
      label,
      newItemTemplate,
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
    } = this.props;

    return (
      <FieldArray
        name={name}
        component={FieldRow}
        template={template}
        containerRef={ref => { this.container = ref; }}
        label={label}
        newItemTemplate={newItemTemplate}
        addLabel={addLabel}
        addButtonId={addButtonId}
        canAdd={canAdd}
        canEdit={canEdit}
        canDelete={canDelete}
        lastRowRef={ref => { this.lastRow = ref; }}
        showAddNewField={showAddNewField}
        fieldsetClass={fieldsetClass}
        layoutClass={layoutClass}
        legendClass={legendClass}
        buttonsContainerClass={buttonsContainerClass}
        fieldsContainerClass={fieldsContainerClass}
        formatter={this.buildComponentFromTemplate}
        onAddField={this.handleAddField}
      />
    );
  }
}

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
