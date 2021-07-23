import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';

const useCentralServers = (history, servers) => {
  const [selectedServer, setSelectedServer] = useState({});
  const [isPristine, setIsPristine] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [nextLocation, setNextLocation] = useState(null);
  const [isResetForm, setIsResetForm] = useState(false);
  const unblockRef = useRef();

  const serverOptions = useMemo(() => servers.map(({ id, name }) => ({
    id,
    value: name,
    label: name,
  })), [servers]);

  const changePristineState = (value) => {
    setIsPristine(value);
  };

  const changeFormResetState = (value) => {
    setIsResetForm(value);
  };

  const handleServerChange = (selectedServerName) => {
    if (selectedServerName === selectedServer.name) return;
    const optedServer = servers.find(server => server.name === selectedServerName);

    setSelectedServer(optedServer);
  };

  const handleModalConfirm = () => {
    setOpenModal(false);
  };

  const navigate = () => {
    unblockRef.current();
    history.push(nextLocation?.pathname);
  };

  const handleModalCancel = () => {
    setSelectedServer({});
    setOpenModal(false);
    setIsResetForm(true);
    navigate();
  };

  useEffect(() => {
    unblockRef.current = history.block(nextLocat => {
      if (isPristine) {
        setSelectedServer({});
      } else {
        setOpenModal(true);
        setNextLocation(nextLocat);
      }

      return isPristine;
    });

    return () => unblockRef.current();
  }, [isPristine, history]);

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

export default useCentralServers;
