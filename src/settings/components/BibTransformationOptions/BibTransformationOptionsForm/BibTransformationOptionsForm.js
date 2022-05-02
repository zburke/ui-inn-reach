import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  isEqual,
} from 'lodash';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  Loading,
  Pane,
  PaneFooter,
  Selection,
  Checkbox,
  TextArea,
} from '@folio/stripes-components';
import stripesFinalForm from '@folio/stripes/final-form';
import {
  Field,
} from 'react-final-form';
import {
  BIB_TRANSFORMATION_FIELDS,
  CENTRAL_SERVER_ID,
  DEFAULT_INITIAL_VALUES,
  DEFAULT_PANE_WIDTH,
  TEXTAREA_ROWS_NUMBER,
} from '../../../../constants';
import TabularList from './components/TabularList';
import {
  getIdentifierTypeOptions,
} from './utils';
import css from './BibTransformationOptionsForm.css';

const {
  CONFIG_IS_ACTIVE,
  MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS,
  RESOURCE_IDENTIFIER_TYPE_ID,
  EXCLUDED_MARC_FIELDS,
} = BIB_TRANSFORMATION_FIELDS;

const BibTransformationOptionsForm = ({
  selectedServer,
  serverOptions,
  identifierTypes,
  formatMessage,
  handleSubmit,
  initialValues,
  values,
  pristine,
  form,
  isMarcTransformationOptionsPending,
  isConfigActive,
  onChangeServer,
  onChangeConfigState,
}) => {
  const [canSave, setCanSave] = useState(false);

  const tabularListValues = values[MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS];
  const identifierTypeOptions = useMemo(() => {
    return getIdentifierTypeOptions(identifierTypes, tabularListValues);
  }, [identifierTypes, tabularListValues]);

  useEffect(() => {
    const tabularList = values[MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS];
    const isCreatingNewConfig = isEqual(
      initialValues[MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS],
      DEFAULT_INITIAL_VALUES[MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS]
    );

    if (isConfigActive && isCreatingNewConfig) {
      const isSomeIdentifierTypeFilledIn = tabularList.some(row => row[RESOURCE_IDENTIFIER_TYPE_ID]);
      const hasStripFieldChanged = initialValues[EXCLUDED_MARC_FIELDS] !== values[EXCLUDED_MARC_FIELDS];

      setCanSave(isSomeIdentifierTypeFilledIn || hasStripFieldChanged);
    } else {
      const hasTabularListValues = initialValues[MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS][0][RESOURCE_IDENTIFIER_TYPE_ID];

      if (!isConfigActive && hasTabularListValues) {
        setCanSave(true);
      } else {
        setCanSave(!pristine);
      }
    }
  }, [values, pristine, isConfigActive]);

  const getFooter = () => {
    const saveButton = (
      <Button
        marginBottom0
        buttonStyle="primary mega"
        type="submit"
        disabled={!canSave}
        onClick={handleSubmit}
      >
        <FormattedMessage id="ui-inn-reach.settings.bib-transformation.button.save" />
      </Button>
    );

    return <PaneFooter renderEnd={saveButton} />;
  };

  return (
    <Pane
      defaultWidth={DEFAULT_PANE_WIDTH}
      footer={getFooter()}
      paneTitle={<FormattedMessage id="ui-inn-reach.settings.bib-transformation.title" />}
    >
      <form>
        <Selection
          id={CENTRAL_SERVER_ID}
          label={<FormattedMessage id="ui-inn-reach.settings.field.centralServer" />}
          dataOptions={serverOptions}
          placeholder={formatMessage({ id: 'ui-inn-reach.settings.placeholder.centralServer' })}
          value={selectedServer.name}
          onChange={onChangeServer}
        />
        {isMarcTransformationOptionsPending && <Loading />}
        {selectedServer.id && !isMarcTransformationOptionsPending &&
          <>
            <Checkbox
              id={CONFIG_IS_ACTIVE}
              className={isConfigActive ? css.mbSm : css.mbMd}
              checked={isConfigActive}
              label={<FormattedMessage id="ui-inn-reach.settings.bib-transformation.field.modify-MARC" />}
              onChange={onChangeConfigState(form)}
            />
            {isConfigActive &&
              <TabularList
                identifierTypeOptions={identifierTypeOptions}
                mutators={form.mutators}
              />
            }
            <Field
              id={EXCLUDED_MARC_FIELDS}
              name={EXCLUDED_MARC_FIELDS}
              component={TextArea}
              rows={TEXTAREA_ROWS_NUMBER}
              placeholder={formatMessage({ id: 'ui-inn-reach.settings.bib-transformation.placeholder.strip-fields-and-subfields' })}
              label={<FormattedMessage id="ui-inn-reach.settings.bib-transformation.field.strip-fields-and-subfields" />}
            />
          </>
        }
      </form>
    </Pane>
  );
};

export default stripesFinalForm({
  mutators: {
    addRowAfterCurrent: ([index, newRowValues], state, { changeValue }) => {
      changeValue(state, MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS, values => {
        const newTabularList = [...values];

        newTabularList.splice(index + 1, 0, newRowValues);

        return newTabularList;
      });
    },
    swapRows: ([index1, index2], state, { changeValue }) => {
      changeValue(state, MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS, values => {
        const newTabularList = [...values];

        [newTabularList[index1], newTabularList[index2]] = [newTabularList[index2], newTabularList[index1]];

        return newTabularList;
      });
    },
  },
  initialValuesEqual: isEqual,
  navigationCheck: true,
  subscription: {
    values: true,
    pristine: true,
  },
})(BibTransformationOptionsForm);
