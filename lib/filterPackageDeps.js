const { fromPairs } = require("lodash");

const filterPackageDeps = (names, pkgContent) => {
  const { dependencies = {}, devDependencies = {}, ...pkg } = pkgContent;

  const filteredDeps = Object.entries(dependencies).filter(([name]) =>
    names.includes(name)
  );

  const filteredDevDeps = Object.entries(devDependencies).filter(([name]) =>
    names.includes(name)
  );

  return {
    ...pkg,
    dependencies: filteredDeps.length > 0 ? fromPairs(filteredDeps) : undefined,
    devDependencies:
      filteredDevDeps.length > 0 ? fromPairs(filteredDevDeps) : undefined
  };
};

module.exports = { filterPackageDeps };
