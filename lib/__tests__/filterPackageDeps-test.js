const { filterPackageDeps } = require("../filterPackageDeps");

describe("filterPackageDeps", () => {
  it("should properly filter dependencies in the package.json file", () => {
    const names = ["b", "d"];

    const pkgContent = {
      name: "a",
      version: "0.1.0",
      dependencies: {
        b: "0.1.0",
        c: "0.1.0"
      },
      devDependencies: {
        d: "0.1.0",
        e: "0.1.0"
      }
    };

    expect(filterPackageDeps(names, pkgContent)).toMatchInlineSnapshot(`
Object {
  "dependencies": Object {
    "b": "0.1.0",
  },
  "devDependencies": Object {
    "d": "0.1.0",
  },
  "name": "a",
  "version": "0.1.0",
}
`);
  });
});
