import React from 'react';
import {
  isEqual,
} from 'lodash';
import PropTypes from 'prop-types';
import { FieldArray } from 'react-final-form-arrays';
import {
  Col,
} from '@folio/stripes-components';
import {
  DefaultRow,
  DefaultTitles,
} from './components';

const TableStyleList = ({
  children,
  fieldArrayName,
  customTitles,
  leftTitle,
  rightTitle,
  leftFieldName,
  rightFieldName,
  dataOptions,
  ariaLabel,
  requiredRightCol,
  rootClassName,
  validate,
  onProcessDataOptions,
}) => {
  const getDefaultList = ({ fields }) => fields.map((name, index) => {
    const options = onProcessDataOptions
      ? onProcessDataOptions(fields, index, dataOptions)
      : dataOptions;

    return (
      <DefaultRow
        key={index}
        name={name}
        index={index}
        leftFieldName={leftFieldName}
        rightFieldName={rightFieldName}
        dataOptions={options}
        ariaLabel={ariaLabel}
        validate={validate}
      />
    );
  });

  return (
    <Col
      sm={12}
      className={rootClassName}
      data-testid="table-style-list"
    >
      {
        customTitles ||
        <DefaultTitles
          leftTitle={leftTitle}
          rightTitle={rightTitle}
          requiredRightCol={requiredRightCol}
        />
      }
      <FieldArray
        isEqual={isEqual}
        name={fieldArrayName}
      >
        {children || getDefaultList}
      </FieldArray>
    </Col>
  );
};

TableStyleList.propTypes = {
  fieldArrayName: PropTypes.string.isRequired,
  ariaLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  children: PropTypes.func,
  customTitles: PropTypes.element,
  dataOptions: PropTypes.arrayOf(PropTypes.object),
  leftFieldName: PropTypes.string,
  leftTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  requiredRightCol: PropTypes.bool,
  rightFieldName: PropTypes.string,
  rightTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  rootClassName: PropTypes.string,
  validate: PropTypes.func,
  onProcessDataOptions: PropTypes.func,
};

export default TableStyleList;
