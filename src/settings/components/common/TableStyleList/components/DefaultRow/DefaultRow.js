import React from 'react';
import {
  Col,
  Row,
  Selection,
} from '@folio/stripes-components';
import {
  Field,
} from 'react-final-form';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import css from '../../TableStyleList.css';

const DefaultRow = ({
  name,
  index,
  leftFieldName,
  rightFieldName,
  dataOptions,
  ariaLabel,
  validate,
}) => {
  return (
    <Row className={classNames(css.tabularRow, index % 2 ? css.tabularRowOdd : css.tabularRowEven)}>
      <Col
        sm={6}
        className={classNames(css.tabularCol, css.tabularColFirst)}
      >
        <Field
          id={`${name}.${leftFieldName}-${index}`}
          name={`${name}.${leftFieldName}`}
          component={({ input }) => input.value}
        />
      </Col>
      <Col
        sm={6}
        className={css.tabularCol}
      >
        <Field
          marginBottom0
          id={`${name}.${rightFieldName}-${index}`}
          name={`${name}.${rightFieldName}`}
          aria-label={ariaLabel}
          component={Selection}
          dataOptions={dataOptions}
          validate={validate || undefined}
        />
      </Col>
    </Row>
  );
};

DefaultRow.propTypes = {
  ariaLabel: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
  dataOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  index: PropTypes.number.isRequired,
  leftFieldName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  rightFieldName: PropTypes.string.isRequired,
  validate: PropTypes.func,
};

export default DefaultRow;
