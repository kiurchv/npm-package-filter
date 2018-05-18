const filterPackageDeps = require("./lib/filterPackageDeps");
const filterPackageLockDeps = require("./lib/filterPackageLockDeps");

module.exports = { filterPackageDeps, filterPackageLockDeps };



// const main = async () => {
//   const names = ["@ehealth/iit-proxy"];
//
//   const pkgContent = await parseFile("_package.json");
//   console.log(filterPackageDeps(names, pkgContent));
//
//   const pkgLockContent = await parseFile("_package-lock.json");
//   console.log(filterPackageLockDeps(names, pkgLockContent));
// }
//
// main();
