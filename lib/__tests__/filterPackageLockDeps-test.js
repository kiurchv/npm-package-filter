const {
  filterPackageLockDeps,
  collectDeps,
  getHoistedDeps
} = require("../filterPackageLockDeps");

describe("filterPackageLockDeps", () => {
  it("should properly filter dependencies in the package-lock.json file", () => {
    const names = ["a"];

    const pkgLockContent = {
      requires: true,
      lockfileVersion: 1,
      dependencies: {
        a: {
          version: "0.1.0",
          requires: {
            b: "0.1.0",
            c: "0.1.0"
          },
          dependencies: {
            c: {
              version: "0.1.0",
              requires: {
                d: "0.1.0"
              }
            }
          }
        },
        b: {
          version: "0.1.0"
        },
        c: {
          version: "0.2.0"
        },
        d: {
          version: "0.1.0"
        },
        e: {
          version: "0.1.0"
        }
      }
    };

    expect(filterPackageLockDeps(names, pkgLockContent)).toMatchInlineSnapshot(`
Object {
  "dependencies": Object {
    "a": Object {
      "dependencies": Object {
        "c": Object {
          "requires": Object {
            "d": "0.1.0",
          },
          "version": "0.1.0",
        },
      },
      "requires": Object {
        "b": "0.1.0",
        "c": "0.1.0",
      },
      "version": "0.1.0",
    },
    "b": Object {
      "version": "0.1.0",
    },
    "d": Object {
      "version": "0.1.0",
    },
  },
  "lockfileVersion": 1,
  "requires": true,
}
`);
  });
});

describe("collectDeps", () => {
  it("should collect root dependencies without ancestors", () => {
    const dependencies = {
      a: {
        version: "0.1.0"
      },
      b: {
        version: "0.1.0"
      }
    };

    const names = ["a"];

    expect(collectDeps(dependencies, names)).toMatchInlineSnapshot(`
Set {
  "a",
}
`);
  });

  it("should collect root dependencies and its ancestor root dependencies", () => {
    const dependencies = {
      a: {
        version: "0.1.0",
        requires: {
          b: "0.1.0"
        }
      },
      b: {
        version: "0.1.0"
      }
    };

    const names = ["a"];

    expect(collectDeps(dependencies, names)).toMatchInlineSnapshot(`
Set {
  "a",
  "b",
}
`);
  });

  it("should collect root dependencies but omit its ancestor nested dependencies", () => {
    const dependencies = {
      a: {
        version: "0.1.0",
        requires: {
          b: "0.1.0"
        },
        dependencies: {
          b: {
            version: "0.1.0"
          }
        }
      },
      b: {
        version: "0.2.0"
      }
    };

    const names = ["a"];

    expect(collectDeps(dependencies, names)).toMatchInlineSnapshot(`
Set {
  "a",
}
`);
  });

  it("should collect root dependencies and root dependencies of its ancestor nested dependencies", () => {
    const dependencies = {
      a: {
        version: "0.1.0",
        requires: {
          b: "0.1.0"
        },
        dependencies: {
          b: {
            version: "0.1.0",
            requires: {
              c: "0.1.0"
            }
          }
        }
      },
      b: {
        version: "0.2.0"
      },
      c: {
        version: "0.1.0"
      }
    };

    const names = ["a"];

    expect(collectDeps(dependencies, names)).toMatchInlineSnapshot(`
Set {
  "a",
  "c",
}
`);
  });

  it("should collect root dependencies and root dependencies of its ancestor nested dependencies recursively", () => {
    const dependencies = {
      a: {
        version: "0.1.0",
        requires: {
          b: "0.1.0"
        },
        dependencies: {
          b: {
            version: "0.1.0",
            requires: {
              c: "0.1.0"
            },
            dependencies: {
              c: {
                version: "0.1.0"
              }
            }
          }
        }
      },
      b: {
        version: "0.2.0"
      },
      c: {
        version: "0.2.0"
      }
    };

    const names = ["a"];

    expect(collectDeps(dependencies, names)).toMatchInlineSnapshot(`
Set {
  "a",
}
`);
  });
});

describe("getHoistedDeps", () => {
  it("should return empty array if there is no root dependencies", () => {
    const requires = undefined;
    const dependencies = undefined;

    expect(getHoistedDeps({ requires, dependencies })).toMatchInlineSnapshot(
      `Array []`
    );
  });
  it("should return required root dependencies", () => {
    const requires = {
      a: "0.1.0"
    };

    const dependencies = undefined;

    expect(getHoistedDeps({ requires, dependencies })).toMatchInlineSnapshot(`
Array [
  "a",
]
`);
  });

  it("should return required root dependencies but omit nested dependencies", () => {
    const requires = {
      a: "0.1.0",
      b: "0.1.0"
    };

    const dependencies = {
      b: {
        version: "0.1.0"
      }
    };

    expect(getHoistedDeps({ requires, dependencies })).toMatchInlineSnapshot(`
Array [
  "a",
]
`);
  });

  it("should return required root dependencies of itself and its nested dependencies", () => {
    const requires = {
      a: "0.1.0"
    };

    const dependencies = {
      a: {
        version: "0.1.0",
        requires: {
          b: "0.1.0"
        }
      }
    };

    expect(getHoistedDeps({ requires, dependencies })).toMatchInlineSnapshot(`
Array [
  "b",
]
`);
  });

  it("should return required root dependencies of itself and its nested dependencies recursively", () => {
    const requires = {
      a: "0.1.0"
    };

    const dependencies = {
      a: {
        version: "0.1.0",
        requires: {
          b: "0.1.0",
          c: "0.1.0"
        },
        dependencies: {
          c: {
            version: "0.1.0",
            requires: {
              d: "0.1.0"
            }
          }
        }
      }
    };

    expect(getHoistedDeps({ requires, dependencies })).toMatchInlineSnapshot(`
Array [
  "b",
  "d",
]
`);
  });
});
