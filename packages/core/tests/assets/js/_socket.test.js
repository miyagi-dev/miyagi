window.io = {
  connect: () => {
    return {
      on: jest.fn(),
    };
  },
};

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("assets/js/_socket", () => {
  describe("if socket-io is available", () => {
    test("it calls io.connect with the origin", async () => {
      const spy = jest.spyOn(window.io, "connect");
      await import("../../../assets/js/_socket.js");
      expect(spy).toHaveBeenCalledWith(window.location.origin);
    });
  });
});
