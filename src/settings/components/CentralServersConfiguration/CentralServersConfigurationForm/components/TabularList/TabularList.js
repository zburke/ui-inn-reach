import React, {
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  Col,
  Row,
  SRStatus,
  TextField,
  MultiSelection,
} from '@folio/stripes-components';
import {
  Field,
} from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import {
  CENTRAL_SERVER_CONFIGURATION_FIELDS,
} from '../../../../../../constants';
import {
  AddAndDeleteButtons,
  TableStyleList,
} from '../../../../common';
import TabularListTitles from './components/TabularListTitles';
import {
  getSelectedLibsSet,
} from '../../utils';
import css from './TabularList.css';

const {
  LOCAL_AGENCIES,
  LOCAL_AGENCY,
  FOLIO_LIBRARIES,
} = CENTRAL_SERVER_CONFIGURATION_FIELDS;

const NEW_ROW_TEMPLATE = {
  [LOCAL_AGENCY]: '',
  [FOLIO_LIBRARIES]: [],
};

const TabularList = ({
  librariesTypeOptions,
}) => {
  const srsRef = useRef();

  return (
    <>
      <SRStatus ref={srsRef} />
      <TableStyleList
        fieldArrayName={LOCAL_AGENCIES}
        customTitles={<TabularListTitles />}
        rootClassName={css.tabularContainer}
      >
        {({ fields }) => fields.map((name, index) => {
          const dataWithoutCurRow = fields.value.filter((_, i) => i !== index);
          const selectedOptsSet = getSelectedLibsSet(dataWithoutCurRow);
          const dataOptions = librariesTypeOptions.filter(({ value: libId }) => !selectedOptsSet.has(libId));
          const isLastRow = index === fields.length - 1;

          return (
            <Row
              key={index}
              className={classNames(css.tabularRow, index % 2 ? css.tabularRowOdd : css.tabularRowEven)}
              data-testid="row"
            >
              <Col className={classNames(css.tabularCol, css.tabularColFirst)}>
                <Field
                  marginBottom0
                  required
                  autoFocus={isLastRow && fields.length > 1}
                  id={`${name}.${LOCAL_AGENCY}-${index}`}
                  name={`${name}.${LOCAL_AGENCY}`}
                  aria-label={<FormattedMessage id="ui-inn-reach.settings.central-server-configuration.local-agency.field.code" />}
                  component={TextField}
                />
              </Col>
              <Col className={css.tabularCol}>
                <Field
                  marginBottom0
                  required
                  id={`${name}.${FOLIO_LIBRARIES}-${index}`}
                  name={`${name}.${FOLIO_LIBRARIES}`}
                  component={MultiSelection}
                  dataOptions={dataOptions}
                  aria-label={<FormattedMessage id="ui-inn-reach.settings.central-server-configuration.local-agency.field.libraries" />}
                />
              </Col>
              <AddAndDeleteButtons
                index={index}
                fields={fields}
                newRowTemplate={NEW_ROW_TEMPLATE}
                srsRef={srsRef}
              />
            </Row>
          );
        })}
      </TableStyleList>
    </>
  );
};

TabularList.propTypes = {
  librariesTypeOptions: PropTypes.arrayOf(PropTypes.object),
};

export default TabularList;
