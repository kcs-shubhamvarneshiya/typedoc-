import { Box } from "@mui/material";
import { DataGrid, GridSortModel, GridToolbar } from "@mui/x-data-grid";
import { useState } from "react";
const UserListing = ({ userListData, usersGridschema }) => {
  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: "name",
      sort: "asc",
    },
  ]);
  return (
    <Box sx={{ height: "auto", width: "100%" }}>
      <DataGrid
        sx={{ flexGrow: 1 }}
        rows={userListData}
        columns={usersGridschema}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        sortingOrder={["asc", "desc"]}
        sortModel={sortModel}
        onSortModelChange={(sort) => setSortModel(sort)}
      />
    </Box>
  );
};
export default UserListing;
