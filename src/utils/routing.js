const CENTRAL_SERVER_CONFIGURATIONS_PATH = 'settings/innreach/central-server-configurations';

export const getCentralServerConfigurationListUrl = () => `${CENTRAL_SERVER_CONFIGURATIONS_PATH}`;
export const getCentralServerConfigurationViewUrl = (id) => `${CENTRAL_SERVER_CONFIGURATIONS_PATH}/${id}/view`;
export const getCentralServerConfigurationCreateUrl = () => `${CENTRAL_SERVER_CONFIGURATIONS_PATH}/create`;
export const getCentralServerConfigurationEditUrl = (id) => `${CENTRAL_SERVER_CONFIGURATIONS_PATH}/${id}/edit`;
