import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';

class DebouncingValidatingField extends Component {
  validate = (...args) => {
    const {
      validate,
      wait,
    } = this.props;

    return (
      new Promise(resolve => {
        if (this.clearTimeout) this.clearTimeout();

        const timerId = setTimeout(() => {
          resolve(validate(...args));
        }, wait);

        this.clearTimeout = () => {
          clearTimeout(timerId);
          resolve();
        };
      })
    );
  };

  render() {
    const {
      children,
    } = this.props;

    return (
      <Field
        {...this.props}
        validate={this.validate}
      >
        {children}
      </Field>
    );
  }
}

DebouncingValidatingField.propTypes = {
  validate: PropTypes.func.isRequired,
  children: PropTypes.func,
  wait: PropTypes.number,
};
DebouncingValidatingField.defaultProps = {
  wait: 300,
};

export default DebouncingValidatingField;
