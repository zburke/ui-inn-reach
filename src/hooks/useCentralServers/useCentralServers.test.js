import { createBrowserHistory } from 'history';
import { renderHook, act } from '@testing-library/react-hooks';
import useCentralServers from './useCentralServers';

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

describe('useCentralServers hook', () => {
  let result;
  let history;

  beforeEach(() => {
    history = createBrowserHistory();

    result = renderHook(() => useCentralServers(history, servers)).result;
  });

  it('should return isPristine state as false', () => {
    const { changePristineState } = result.current;

    act(() => {
      changePristineState(false);
    });
    const { isPristine } = result.current;

    expect(isPristine).toBeFalsy();
  });

  it('should return isResetForm state as true', () => {
    const { changeFormResetState } = result.current;

    act(() => {
      changeFormResetState(true);
    });
    const { isResetForm } = result.current;

    expect(isResetForm).toBeTruthy();
  });

  it('should return selected server state data', () => {
    const { handleServerChange } = result.current;

    act(() => {
      handleServerChange(servers[1].name);
    });
    const { selectedServer } = result.current;

    expect(selectedServer).toMatchObject(servers[1]);
  });

  it('should return correct serverOptions', () => {
    const { serverOptions } = result.current;

    expect(serverOptions).toMatchObject(serverOptionsMock);
  });

  describe('handleModalConfirm', () => {
    it('should close the modal', () => {
      const { handleModalConfirm } = result.current;

      act(() => {
        handleModalConfirm();
      });
      const openModal = result.current[1];

      expect(openModal).toBeFalsy();
    });
  });

  describe('handleModalCancel', () => {
    beforeEach(() => {
      const { handleModalCancel } = result.current;

      act(() => {
        handleModalCancel();
      });
    });

    it('should reset the selected server', () => {
      const { handleServerChange } = result.current;

      act(() => {
        handleServerChange(servers[1].name);
      });

      const { handleModalCancel } = result.current;

      act(() => {
        handleModalCancel();
      });
      const { selectedServer } = result.current;

      expect(selectedServer).toEqual({});
    });

    it('should close modal', () => {
      const { openModal } = result.current;

      expect(openModal).toBeFalsy();
    });

    it('should change isResetForm state to true', () => {
      const { isResetForm } = result.current;

      expect(isResetForm).toBeTruthy();
    });

    it('should navigate to another location', () => {
      const historyPushSpy = jest.spyOn(history, 'push');
      const { handleModalCancel } = result.current;

      act(() => {
        handleModalCancel();
      });
      expect(historyPushSpy.mock.calls[0][0]).toBe();
      historyPushSpy.mockClear();
    });
  });

  describe('unblock function', () => {
    it('should open a modal', async () => {
      const { handleServerChange } = result.current;

      act(() => { handleServerChange(servers[1].name); });
      const { selectedServer: selectedServer1 } = result.current;

      expect(selectedServer1).toEqual(servers[1]);
      act(() => { history.push('/'); });
      const { selectedServer: selectedServer2 } = result.current;

      expect(selectedServer2).toEqual({});
    });

    it('should reset the selected server', () => {
      const { changePristineState } = result.current;

      act(() => { changePristineState(false); });
      act(() => { history.push('/'); });
      const { openModal } = result.current;

      expect(openModal).toBeTruthy();
    });
  });
});
