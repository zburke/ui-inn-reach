import React, { useEffect, useState } from 'react';
import { CONTRIBUTION_CRITERIA } from '../../constants';

const {
  CENTRAL_SERVER_ID,
} = CONTRIBUTION_CRITERIA;

const useServers = (history, servers) => {
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

  const handleModalCancel = () => {
    if (prevServerName) { // if a new central server was selected
      setSelectedServer(nextServer);
    } else { // otherwise, the navigation to the current page or leave from the page was pressed
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
      if (isPristine) { // if we navigate somewhere with empty additional fields
        setSelectedServer({});
      } else if (!isPristine) { // if we navigate somewhere with filled additional fields
        setOpenModal(true);
        setNextLocation(nextLocat);
        setPrevServerName('');
      }

      return isPristine;
    });

    return () => unblock();
  }, [isPristine]);

  return [
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
  ];
};

export default useServers;
