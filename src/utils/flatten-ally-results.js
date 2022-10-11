// this flattens the results from axe-core to something more readable in a table format
const flattenAllyResults = (results) => {
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

  return nodes;
};

module.exports = flattenAllyResults;
