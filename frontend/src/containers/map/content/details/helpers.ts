export const applyFilters = (data, filters) => {
  const filteredData = data?.filter((item) => {
    for (const key in filters) {
      if (!filters[key].length) continue;
      if (!filters[key].includes(item[key])) return false;
    }
    return true;
  });
  return filteredData;
};
