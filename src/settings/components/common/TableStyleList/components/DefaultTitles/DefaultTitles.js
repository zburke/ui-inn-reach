import React from 'react';
import {
  Col,
  Label,
  Row,
} from '@folio/stripes-components';
import PropTypes from 'prop-types';
import css from '../../TableStyleList.css';

const DefaultTitles = ({
  leftTitle,
  rightTitle,
  requiredRightCol,
}) => (
  <Row>
    <Col
      className={css.tabularHeaderCol}
      sm={6}
    >
      <Label>
        {leftTitle}
      </Label>
    </Col>
    <Col
      className={css.tabularHeaderCol}
      sm={6}
    >
      <Label required={requiredRightCol}>
        {rightTitle}
      </Label>
    </Col>
  </Row>
);

DefaultTitles.propTypes = {
  leftTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  rightTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  requiredRightCol: PropTypes.bool,
};

export default DefaultTitles;
