import { signalRMiddleware, config, signalRHub } from '../signalR';

const create = () => {
  const store = {
    getState: jest.fn(),
    dispatch: jest.fn(),
  };

  const next = jest.fn();

  const invoke = (action: any) =>
    signalRMiddleware(signalRHub, config)(store)(next)(action);

  return {
    store,
    next,
    invoke,
  };
};

it('passes through non-function action', () => {});
