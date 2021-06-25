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
    act(() => {
      result.current.changePristineState(false);
    });
    expect(result.current.isPristine).toBeFalsy();
  });

  it('should return isResetForm state as true', () => {
    act(() => {
      result.current.changeFormResetState(true);
    });
    expect(result.current.isResetForm).toBeTruthy();
  });

  describe('selectedServer state', () => {
    it('should return selectedServer state data', () => {
      act(() => {
        result.current.handleServerChange(servers[1].name);
      });
      expect(result.current.selectedServer).toMatchObject(servers[1]);
    });

    it('should return right selectedServer state', () => {
      act(() => {
        result.current.changeSelectedServer(servers[0]);
      });
      expect(result.current.selectedServer).toMatchObject(servers[0]);
    });

    it('should reset selectedServer state', () => {
      act(() => {
        result.current.changeSelectedServer(servers[0]);
      });
      expect(result.all[1].selectedServer).toEqual(servers[0]);
      act(() => {
        history.push('/');
      });
      expect(result.all[2].selectedServer).toEqual({});
    });
  });

  describe('openModal state', () => {
    it('should return openModal state as true', () => {
      act(() => {
        result.current.changePristineState(false);
      });
      act(() => {
        result.all[1].handleServerChange(servers[1].name);
      });
      expect(result.all[2].openModal).toBeTruthy();
    });

    it('should return openModal state', () => {
      act(() => {
        result.current.changeModalState(true);
      });
      expect(result.current.openModal).toBeTruthy();
    });

    it('should open modal', () => {
      act(() => {
        result.current.changePristineState(false);
      });
      act(() => {
        history.push('/');
      });
      expect(result.all[2].openModal).toBeTruthy();
    });
  });

  it('should return correct serverOptions', () => {
    expect(result.current.serverOptions).toMatchObject(serverOptionsMock);
  });

  it('should change prevServerName state', () => {
    act(() => {
      result.current.changePrevServerName(servers[0].name);
    });
    act(() => {
      result.all[1].changeNextServer(servers[1]);
    });
    act(() => {
      result.all[2].handleModalCancel();
    });
    expect(result.all[3].selectedServer).toEqual(servers[1]);
  });

  describe('handleModalConfirm', () => {
    it('should close the modal', () => {
      act(() => {
        result.current.handleModalConfirm();
      });
      expect(result.current.openModal).toBeFalsy();
    });

    it('should change selection option if prevServerName is true', () => {
      act(() => {
        result.current.handleServerChange(servers[0].name);
      });
      act(() => {
        result.all[1].handleServerChange(servers[1].name);
      });
      act(() => {
        result.all[2].handleModalConfirm();
      });
    });
  });

  describe('handleModalCancel', () => {
    beforeEach(() => {
      act(() => {
        result.current.handleModalCancel();
      });
    });

    it('should close modal', () => {
      expect(result.current.openModal).toBeFalsy();
    });

    it('should change isResetForm state to true', () => {
      expect(result.current.isResetForm).toBeTruthy();
    });

    it('should make navigation', () => {
      const historyPushSpy = jest.spyOn(history, 'push');

      act(() => {
        result.current.changePristineState(false);
      });
      act(() => {
        history.push('/');
      });
      act(() => {
        result.current.changePristineState(true);
      });
      expect(historyPushSpy.mock.calls[0][1]).toEqual(undefined);
      historyPushSpy.mockClear();
    });
  });
});
