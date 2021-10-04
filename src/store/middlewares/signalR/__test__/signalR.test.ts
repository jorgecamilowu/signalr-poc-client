import { signalRMiddleware, signalRHub } from "../signalR";

const mockStore = {
  dispatch: jest.fn(),
  getState: jest.fn(),
};

const next = jest.fn();
const mockAction = {};

const mockCallback = jest.fn();

const mockMethodsConfig = new Map([["Foo", mockCallback]]);
const mockOnCloseConfig = [mockCallback];

const systemUnderTest = signalRMiddleware(
  signalRHub,
  mockMethodsConfig,
  mockOnCloseConfig
);

describe("Functional Tests for the SignalR middleware", () => {
  jest.spyOn(signalRHub, "on");
  jest.spyOn(signalRHub, "onclose");
  describe("Tests method configs", () => {
    beforeEach(() => {
      systemUnderTest(mockStore)(next)(mockAction);
    });
    it("should register method side effects", () => {
      expect(signalRHub.on).toHaveBeenCalledTimes(1);
      expect(signalRHub.on).toHaveBeenNthCalledWith(
        1,
        "Foo",
        expect.any(Function)
      );
    });

    it("should register onclose side effects", () => {
      expect(signalRHub.onclose).toHaveBeenCalledTimes(1);
    });
  });
});
