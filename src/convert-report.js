const fs = require("fs");
const nodes = require("../results/dataset-ally.json");
const { parse } = require("json2csv");
const flattenAllyResults = require("./utils/flatten-ally-results");
const path = require("path");

const fields = [
  "violationId",
  "url",
  "impact",
  "help",
  "failureSummary",
  "html",
];
const opts = { fields };
const flattenedData = flattenAllyResults(nodes);

try {
  const csv = parse(flattenedData, opts);

  fs.writeFileSync(
    path.join(__dirname, "../results/dataset-ally-table.csv"),
    csv
  );
} catch (err) {
  console.error(err);
}
