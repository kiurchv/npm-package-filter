const { fromPairs } = require("lodash");

const filterPackageLockDeps = (names, pkgLockContent) => {
  const { dependencies, ...pkgLock } = pkgLockContent;

  const preservedDeps = collectDeps(dependencies, names);

  const filteredDeps = Object.entries(dependencies).filter(([name]) =>
    preservedDeps.has(name)
  );

  return { ...pkgLock, dependencies: fromPairs(filteredDeps) };
};

const collectDeps = (rootDeps, names) => {
  const collectedDeps = new Set();

  const find = names => {
    names.forEach(name => {
      if (collectedDeps.has(name)) return;

      collectedDeps.add(name);
      find(getHoistedDeps(rootDeps[name]));
    });
  };

  find(names);

  return collectedDeps;
};

const getHoistedDeps = ({ requires, dependencies }) => {
  if (!requires) return [];

  if (dependencies) {
    const directRequires = Object.keys(requires).filter(
      name => !Object.keys(dependencies).includes(name)
    );

    const nestedRequires = Object.values(dependencies).reduce(
      (requires, nestedDependency) => {
        const nestedRequires = getHoistedDeps(nestedDependency);

        return [...requires, ...nestedRequires];
      },
      []
    );

    return [...directRequires, ...nestedRequires];
  } else {
    return Object.keys(requires);
  }
};

module.exports = { filterPackageLockDeps, collectDeps, getHoistedDeps };
