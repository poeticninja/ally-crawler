// react component that displays a table of results from the dataset-ally.json file
import React, { useState } from "react";

import { Table } from "./table";
import results from "../../../results/dataset-ally.json";

// function that takes in a dataset and groups it by the given key
function groupBy(dataset, key) {
  return dataset.reduce((result, item) => {
    (result[item[key]] = result[item[key]] || []).push(item);
    return result;
  }, {});
}

// convert groupBy results into an array of objects
function convertGroupByResultsToArray(groupByResults, group) {
  return Object.keys(groupByResults).map((key) => ({
    [group]: key,
    nodes: groupByResults[key],
  }));
}

// group the data by given key and return in desired table format
function groupDataToTableFormat(dataset, group) {
  const groupByResults = groupBy(dataset, group);
  return convertGroupByResultsToArray(groupByResults, group);
}

// flatten the results violations into a single array
const violations = results.reduce((acc, result) => {
  // keep the url property from the result
  const url = result.url;
  // map the violations to include the url
  const violations = result.violations.map((violation) => ({
    ...violation,
    url,
  }));
  // add the violations to the accumulator
  return [...acc, ...violations];
}, []);

// flatten the violations nodes into a single array
const nodes = violations.reduce((acc, violation) => {
  // keep properties from the violation
  const { nodes, id, ...rest } = violation;

  // change id to violationId so that it doesnt conflict with the data table id
  const violationId = id;

  // map the nodes to include violation properties and add the violation id
  const mappedNodes = nodes.map((node) => ({
    violationId,
    ...node,
    ...rest,
  }));
  // add the nodes to the accumulator
  return [...acc, ...mappedNodes];
}, []);

// dropdown options for the group by select
const groupByOptions = [
  {
    label: "None",
    value: "none",
  },
  {
    label: "URL",
    value: "url",
  },
  {
    label: "Violation",
    value: "violationId",
  },
  {
    label: "Impact",
    value: "impact",
  },
  {
    label: "Summary",
    value: "failureSummary",
  },
  {
    label: "HTML",
    value: "html",
  },
];

// dropdown options for the group by select
export function App() {
  // grouping state
  const [group, setGroup] = useState("none");

  const handleGroupByChange = (event) => {
    // get the value of the select
    const value = event.target.value;

    if (value === "none") {
      setGroup("none");
    }

    // set the group by state
    setGroup(value);
  };

  // if there is a group, use the grouped nodes by given key, otherwise use the nodes
  const data = group === "none" ? nodes : groupDataToTableFormat(nodes, group);

  return (
    <div>
      <h3>Total Issues: {nodes.length}</h3>
      <div>
        <label htmlFor="group-by">Group By</label>
        <select id="group-by" value={group} onChange={handleGroupByChange}>
          {groupByOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <Table data={data} group={group} />
    </div>
  );
}
