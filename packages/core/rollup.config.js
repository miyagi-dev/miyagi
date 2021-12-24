import { writeFile, mkdir, rm } from "fs/promises";

export default [
  {
    input: "./api/index.js",
    plugins: [createCommonJsPackage()],
    output: [{ format: "cjs", dir: "./api/cjs/" }],
  },
];

function createCommonJsPackage() {
  const pkg = { type: "commonjs" };
  return {
    name: "cjs-package",
    buildEnd: async () => {
      await rm("./api/cjs", { recursive: true, force: true });
      await mkdir("./api/cjs", { recursive: true });
      await writeFile("./api/cjs/package.json", JSON.stringify(pkg, null, 2));
    },
  };
}
