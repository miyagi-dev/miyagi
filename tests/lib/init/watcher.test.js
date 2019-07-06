const setState = require("../../../lib/state/index.js");
const setWatcher = require("../../../lib/init/watcher.js");
const chokidar = require("chokidar");

jest.mock("../../../lib/state/index.js");

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/init/watcher", () => {
  test.todo("");
});
