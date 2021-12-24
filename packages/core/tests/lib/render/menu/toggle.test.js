import { render as renderToggle } from "../../../../lib/render/menu/toggle.js";

beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/menu/elements/toggle", () => {
  test("renders the correct toggle html", () => {
    expect(renderToggle(1, true, 2)).toEqual(
      `<button class="Menu-toggle Menu-toggle--lvl2" aria-controls="1" aria-expanded="true" title="Toggle submenu"></button>`
    );
  });
});
