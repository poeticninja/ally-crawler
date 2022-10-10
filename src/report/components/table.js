import DataTable from "react-data-table-component";

const columns = [
  {
    name: "URL",
    selector: (row) => row.url,
    sortable: true,
    reorder: true,
    cell: (row) => (
      <a href={row.url} target="_blank" rel="noopener noreferrer">
        {row.url}
      </a>
    ),
  },
  {
    name: "Violation",
    selector: (row) => row.violationId,
    sortable: true,
    reorder: true,
  },
  {
    name: "Impact",
    selector: (row) => row.impact,
    sortable: true,
    reorder: true,
  },
  {
    name: "Help",
    selector: (row) => row.help,
    sortable: true,
    reorder: true,
  },
  {
    name: "Summary",
    selector: (row) => row.failureSummary,
    sortable: true,
    reorder: true,
    wrap: true,
    cell: (row) => (
      <div
        dangerouslySetInnerHTML={{
          __html: row?.failureSummary?.replace(/\n/g, "<br />"),
        }}
      />
    ),
  },
  {
    name: "HTML",
    selector: (row) => row.html,
    sortable: true,
    reorder: true,
    wrap: true,
  },
  {
    name: "Help URL",
    selector: (row) => row.helpUrl,
    sortable: true,
    reorder: true,
    cell: (row) => (
      <a href={row.helpUrl} target="_blank" rel="noopener noreferrer">
        {row.helpUrl}
      </a>
    ),
  },
];

// A super simple expandable component.
const ExpandedRowDetails = ({ data }) => (
  <div
    style={{
      border: "4px solid #f5f5f5",
      fontSize: ".8em",
      backgroundColor: "#f5f5f5",
    }}
  >
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>
);

// A super simple expandable component.
const ExpandedTable = ({ data }) => (
  <div
    style={{
      border: "4px solid #f5f5f5",
    }}
  >
    <h4>Issues: {data.length}</h4>
    <DataTable
      columns={columns}
      data={data}
      expandableRows
      dense
      highlightOnHover
      pagination
      expandableRowsComponent={ExpandedRowDetails}
      paginationComponentOptions={{
        selectAllRowsItem: true,
      }}
    />
  </div>
);

export function Table({ data, group }) {  
  return (
    <DataTable
      columns={columns}
      data={data}
      expandableRows
      dense
      highlightOnHover
      expandableRowsComponent={(row) => {
        if (group !== "none") {
          return <ExpandedTable data={row?.data?.nodes} />;
        }
        return <ExpandedRowDetails data={row} />;
      }}
      pagination
      paginationComponentOptions={{
        selectAllRowsItem: true,
      }}
    />
  );
}
