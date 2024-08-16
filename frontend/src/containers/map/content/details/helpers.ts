type Row = { [key: string]: unknown };
type Rows = (Row & { subRows?: Row[] })[];
type Filters = Record<string, string[]>;

export const applyFilters = (data: Rows, filters: Filters) => {
  const filteredData = [];

  for (const row of data) {
    let keep = true; // Whether the row is kept or filtered out
    let filteredSubRows = row.subRows;

    for (const key in filters) {
      // If the filter doesn't have any value, we look at the next filter
      if (!filters[key].length) {
        continue;
      }

      // We apply the filters to the sub rows using recursion
      if (filteredSubRows?.length) {
        filteredSubRows = applyFilters(filteredSubRows, filters);
      }

      // If the row's value doesn't match any of the filter's value and the number of matching sub
      // rows (if any) is 0, the row is filtered out
      if (
        !filters[key].includes(row[key] as string) &&
        (!filteredSubRows || filteredSubRows.length === 0)
      ) {
        keep = false;
        break;
      }
    }

    if (keep) {
      // We create a new row to define a new list of sub rows, if any
      const newRow = { ...row };
      if (filteredSubRows) {
        newRow.subRows = filteredSubRows;
      }

      filteredData.push(newRow);
    }
  }

  return filteredData;
};
