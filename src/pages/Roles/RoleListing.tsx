import { Box } from "@mui/material";
import { DataGrid, GridSortModel, GridToolbar } from "@mui/x-data-grid";
import { useState } from "react";
const RoleListing = ({ userListData, rolesGridSchema }) => {
  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: "name",
      sort: "asc",
    },
  ]);
  const exportData = userListData.map((row) => {
    const rowData = {};
    rolesGridSchema.forEach((column) => {
      rowData[column.field] = row[column.field];
    });
    return rowData;
  });
  return (
    <>
      <Box sx={{ height: "100%", width: "100%" }}>
        <DataGrid
          rows={userListData}
          columns={rolesGridSchema}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          autoHeight
          sortingOrder={["asc", "desc"]}
          sortModel={sortModel}
          onSortModelChange={(sort) => setSortModel(sort)}
        />
      </Box>
    </>
  );
};
export default RoleListing;
