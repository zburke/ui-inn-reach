import React, {
  useEffect,
  useState,
} from 'react';
import stripesFinalForm from '@folio/stripes/final-form';
import {
  isEqual,
} from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  Loading,
  Pane,
  PaneFooter,
  Select,
  Selection,
} from '@folio/stripes-components';
import {
  DEFAULT_PANE_WIDTH,
  FOLIO_TO_INN_REACH_LOCATIONS,
} from '../../../../constants';
import { TabularList } from './components';

const {
  CENTRAL_SERVER,
  MAPPING_TYPE,
  LIBRARY,
  INN_REACH_LOCATIONS,
} = FOLIO_TO_INN_REACH_LOCATIONS;

const FolioToInnReachLocationsForm = ({
  selectedServer,
  mappingType,
  innReachLocations,
  isPristine,
  serverOptions,
  serverLibrariesOptions,
  mappingTypesOptions,
  formatMessage,
  librariesMappingType,
  locationsMappingType,
  initialValues,
  isMappingsPending,
  leftColumnName,
  isShowTabularList,
  isResetForm,
  handleSubmit,
  values,
  form,
  onChangePristineState,
  onChangeFormResetState,
  onChangeServer,
  onChangeMappingType,
  onChangeLibrary,
}) => {
  const [isRequiredFieldsFilledIn, setIsRequiredFieldsFilledIn] = useState(false);

  const handleMappingTypeChange = (event) => {
    onChangeMappingType(event.target.value);
  };

  useEffect(() => {
    if (isResetForm) {
      form.reset();
      onChangeFormResetState(false);
    }
  }, [isResetForm]);

  useEffect(() => {
    const {
      tabularList,
    } = values;

    if (tabularList) {
      if (mappingType === librariesMappingType) {
        const isAllFieldsFilledIn = tabularList.every(row => row[INN_REACH_LOCATIONS]);

        setIsRequiredFieldsFilledIn(isAllFieldsFilledIn);
      } else if (mappingType === locationsMappingType) {
        const isSomeFieldFilledIn = tabularList.some(row => row[INN_REACH_LOCATIONS]);

        setIsRequiredFieldsFilledIn(isSomeFieldFilledIn);
      }
    }

    onChangePristineState(isEqual(initialValues, values));
  }, [values]);

  const getFooter = () => {
    const saveButton = (
      <Button
        marginBottom0
        data-testid="save-button"
        id="clickable-save-instance"
        buttonStyle="primary small"
        type="submit"
        disabled={isPristine || !isRequiredFieldsFilledIn}
        onClick={handleSubmit}
      >
        <FormattedMessage id="ui-inn-reach.settings.contribution-criteria.button.save" />
      </Button>
    );

    return <PaneFooter renderEnd={saveButton} />;
  };

  return (
    <Pane
      defaultWidth={DEFAULT_PANE_WIDTH}
      footer={getFooter()}
      paneTitle={<FormattedMessage id='ui-inn-reach.settings.folio-to-inn-reach-locations.title' />}
    >
      <Selection
        id={CENTRAL_SERVER}
        label={<FormattedMessage id="ui-inn-reach.settings.contribution-criteria.field.centralServer" />}
        dataOptions={serverOptions}
        placeholder={formatMessage({ id: 'ui-inn-reach.settings.contribution-criteria.placeholder.centralServer' })}
        value={selectedServer.name}
        onChange={onChangeServer}
      />
      {selectedServer.id &&
      <Select
        id={MAPPING_TYPE}
        label={<FormattedMessage id="ui-inn-reach.settings.folio-to-inn-reach-locations.field.mapping-type" />}
        dataOptions={mappingTypesOptions}
        value={mappingType}
        onChange={handleMappingTypeChange}
      />
      }
      {mappingType === locationsMappingType &&
      <Selection
        id={LIBRARY}
        label={<FormattedMessage id="ui-inn-reach.settings.folio-to-inn-reach-locations.field.library" />}
        placeholder={formatMessage({ id: 'ui-inn-reach.settings.folio-to-inn-reach-locations.placeholder.select-library' })}
        dataOptions={serverLibrariesOptions}
        onChange={onChangeLibrary}
      />
      }
      {isMappingsPending && <Loading />}
      <form>
        {isShowTabularList &&
          <TabularList
            innReachLocations={innReachLocations}
            leftColumnName={leftColumnName}
          />
        }
      </form>
    </Pane>
  );
};

FolioToInnReachLocationsForm.propTypes = {
  form: PropTypes.object.isRequired,
  formatMessage: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  innReachLocations: PropTypes.arrayOf(PropTypes.object).isRequired,
  isMappingsPending: PropTypes.bool.isRequired,
  isPristine: PropTypes.bool.isRequired,
  isResetForm: PropTypes.bool.isRequired,
  isShowTabularList: PropTypes.bool.isRequired,
  leftColumnName: PropTypes.string.isRequired,
  librariesMappingType: PropTypes.string.isRequired,
  locationsMappingType: PropTypes.string.isRequired,
  mappingType: PropTypes.string.isRequired,
  mappingTypesOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedServer: PropTypes.object.isRequired,
  serverLibrariesOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  serverOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  values: PropTypes.object.isRequired,
  onChangeFormResetState: PropTypes.func.isRequired,
  onChangeLibrary: PropTypes.func.isRequired,
  onChangeMappingType: PropTypes.func.isRequired,
  onChangePristineState: PropTypes.func.isRequired,
  onChangeServer: PropTypes.func.isRequired,
};

export default stripesFinalForm({
  subscription: {
    values: true,
  },
})(FolioToInnReachLocationsForm);
