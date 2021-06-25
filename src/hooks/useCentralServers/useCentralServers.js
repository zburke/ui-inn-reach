import React, { useEffect, useState } from 'react';
import { CONTRIBUTION_CRITERIA } from '../../constants';

const {
  CENTRAL_SERVER_ID,
} = CONTRIBUTION_CRITERIA;

const useCentralServers = (history, servers, extraNavigationConditions = []) => {
  const [selectedServer, setSelectedServer] = useState({});
  const [isPristine, setIsPristine] = useState(true);
  const [prevServerName, setPrevServerName] = useState('');
  const [nextServer, setNextServer] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [nextLocation, setNextLocation] = useState(null);
  const [isResetForm, setIsResetForm] = useState(false);

  const serverOptions = servers.map(({ id, name }) => ({
    id,
    value: name,
    label: name,
  }));

  const changePristineState = (value) => {
    setIsPristine(value);
  };

  const changeFormResetState = (value) => {
    setIsResetForm(value);
  };

  const changeModalState = (value) => {
    setOpenModal(value);
  };

  const changeNextServer = (value) => {
    setNextServer(value);
  };

  const changeSelectedServer = (value) => {
    setSelectedServer(value);
  };

  const changePrevServerName = (value) => {
    setPrevServerName(value);
  };

  const handleServerChange = (selectedServerName) => {
    const optedServer = servers.find(server => server.name === selectedServerName);
    const isNewServerSelected = selectedServerName !== selectedServer.name;

    if (isNewServerSelected) {
      if (isPristine) {
        setSelectedServer(optedServer);
      } else {
        setOpenModal(true);
        setNextServer(selectedServer);
      }

      setPrevServerName(selectedServer.name);
    }
  };

  const backPrevServer = () => {
    const index = servers.findIndex(server => server.name === prevServerName);
    const prevOption = document.getElementById(`option-${CENTRAL_SERVER_ID}-${index}-${prevServerName}`);

    if (prevOption) prevOption.click();
  };

  const handleModalConfirm = () => {
    if (prevServerName) { // if a new central server was selected
      backPrevServer();
    }

    setNextLocation(null);
    setOpenModal(false);
  };

  const handleModalCancel = ({ isStopServerReset } = {}) => {
    if (prevServerName) { // if a new central server was selected
      setSelectedServer(nextServer);
    } else if (!isStopServerReset) { // otherwise, the navigation to the current page or leave from the page was pressed
      setSelectedServer({});
    }

    setOpenModal(false);
    setIsResetForm(true);
  };

  useEffect(() => {
    if (isPristine && nextLocation) {
      setNextLocation(null);
      history.push(nextLocation.pathname);
    }
  }, [isPristine, nextLocation]);

  useEffect(() => {
    const unblock = history.block(nextLocat => {
      const shouldNavigate = isPristine && extraNavigationConditions.every(cond => !cond);

      if (shouldNavigate) { // if we navigate somewhere with empty fields
        setSelectedServer({});
      } else { // if we navigate somewhere and at least one field is filled
        setOpenModal(true);
        setNextLocation(nextLocat);
        setPrevServerName('');
      }

      return isPristine;
    });

    return unblock;
  }, [isPristine, extraNavigationConditions]);

  return {
    selectedServer,
    openModal,
    isResetForm,
    isPristine,
    serverOptions,
    changePristineState,
    changeFormResetState,
    handleServerChange,
    handleModalConfirm,
    handleModalCancel,
    changeModalState,
    changeNextServer,
    changeSelectedServer,
    changePrevServerName,
  };
};

export default useCentralServers;
