import { createBrowserHistory } from 'history';
import { renderHook, act } from '@testing-library/react-hooks';
import { useServers } from './index';

const servers = [
  {
    id: '1',
    name: 'testServerName1',
  },
  {
    id: '2',
    name: 'testServerName2',
  },
];

const serverOptionsMock = [
  { id: '1', value: 'testServerName1', label: 'testServerName1' },
  { id: '2', value: 'testServerName2', label: 'testServerName2' }
];

describe('useServers hook', () => {
  let result;

  beforeEach(() => {
    const history = createBrowserHistory();

    result = renderHook(() => useServers(history, servers)).result;
  });

  it('should return isPristine state as false', () => {
    const changePristineState = result.current[5];

    act(() => {
      changePristineState(false);
    });
    const isPristine = result.current[3];

    expect(isPristine).toBeFalsy();
  });

  it('should return isResetForm state as true', () => {
    const changeFormResetState = result.current[6];

    act(() => {
      changeFormResetState(true);
    });
    const isResetForm = result.current[2];

    expect(isResetForm).toBeTruthy();
  });

  it('should return selected server state data', () => {
    const handleServerChange = result.current[7];

    act(() => {
      handleServerChange(servers[1].name);
    });
    const selectedServer = result.current[0];

    expect(selectedServer).toMatchObject(servers[1]);
  });

  it('should return openModal state as true', () => {
    const changePristineState = result.current[5];

    act(() => {
      changePristineState(false);
    });
    const handleServerChange = result.all[1][7];

    act(() => {
      handleServerChange(servers[1].name);
    });
    const openModal = result.all[2][1];

    expect(openModal).toBeTruthy();
  });

  it('should return correct serverOptions', () => {
    const serverOptions = result.current[4];

    expect(serverOptions).toMatchObject(serverOptionsMock);
  });

  describe('handleModalConfirm', () => {
    it('should close the modal', () => {
      const handleModalConfirm = result.current[8];

      act(() => {
        handleModalConfirm();
      });
      const openModal = result.current[1];

      expect(openModal).toBeFalsy();
    });

    it('should change selection option if prevServerName is true', () => {
      const handleServerChange = result.current[7];

      act(() => {
        handleServerChange(servers[0].name);
      });

      const handleServerChangeAgain = result.all[1][7];

      act(() => {
        handleServerChangeAgain(servers[1].name);
      });

      const handleModalConfirm = result.all[2][8];

      act(() => {
        handleModalConfirm();
      });
    });
  });

  describe('handleModalCancel', () => {
    beforeEach(() => {
      const handleModalCancel = result.current[9];

      act(() => {
        handleModalCancel();
      });
    });

    it('should close modal', () => {
      const openModal = result.current[1];

      expect(openModal).toBeFalsy();
    });

    it('should change isResetForm state to true', () => {
      const isResetForm = result.current[2];

      expect(isResetForm).toBeTruthy();
    });
  });
});
