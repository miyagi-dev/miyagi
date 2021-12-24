import { render as renderList } from "../../../../lib/render/menu/list.js";

beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/menu/elements/list", () => {
  test("renders the correct list html", () => {
    expect(renderList("variations", 1, "content")).toEqual(
      `<ul class="Menu-list Menu-list--lvl1 Menu-list--variations">content</ul>`
    );
  });
});
