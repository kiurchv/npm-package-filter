const path = require("path");
const { promises: { readFile, writeFile } } = require("fs");

const yargs = require("yargs");
const getStdin = require("get-stdin");

const filterPackageDeps = require("./lib/filterPackageDeps");
const filterPackageLockDeps = require("./lib/filterPackageLockDeps");

const { argv } = yargs
  .describe("type", "File type to filter")
  .choices("type", ["package", "package-lock"])
  .alias("type", "t")
  .demandOption("type")

  .describe("only", "Names of preserved packages")
  .array("only")
  .demandOption("only")

  .describe("input", "Path to input file")
  .alias("input", "i")
  .describe("output", "Path to output file")
  .alias("output", "o")
  .coerce(["input", "output"], arg => path.resolve(process.cwd(), arg))

  .help();

const main = async ({ type, only, input, output }) => {
  try {
    const content = JSON.parse(await getInputContent(type, input));

    const filterFn =
      type === "package" ? filterPackageDeps : filterPackageLockDeps;
    const result = filterFn(only, content);

    return writeOutput(output, JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
};

const getInputContent = async (type, input) => {
  try {
    if (input) return readFile(input, "utf8");

    const stdinContent = await getStdin();

    if (stdinContent.length > 0) return stdinContent;

    const defaultInputPath = path.resolve(process.cwd(), `${type}.json`);
    const defaultInputContent = await readFile(defaultInputPath, "utf8");

    if (defaultInputContent.length === 0) throw null;
    return defaultInputContent;
  } catch {
    throw new Error("Input file is not found or empty");
  }
};

const writeOutput = (output, content) => {
  if (output) {
    return writeFile(output, content);
  } else {
    process.stdout.write(content);
  }
}

main(argv);
