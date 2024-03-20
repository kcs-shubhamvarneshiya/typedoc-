import Box from "@mui/material/Box";
import { DataGrid, GridSortModel, GridToolbar } from "@mui/x-data-grid";
import { useState } from "react";
export const SettingGrid = ({
  data,
  column,
  sortByField = "",
  sortByOrder = null,
}) => {

  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: sortByField,
      sort: sortByOrder  
    }
  ]);

  return (
    <Box>
      <DataGrid
        sx={{
          height: "100%",
          width: "100%",
          "& .MuiDataGrid-columnHeaderTitle": {
            whiteSpace: "normal",
            lineHeight: "normal",
          },
        }}
        rows={data}
        columns={column}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        initialState={{
          pagination: { paginationModel: { pageSize: 25 } },
        }}
        pageSizeOptions={[25, 50, 100]}
        autoHeight
        sortingOrder={["asc","desc"]}
        sortModel={sortModel}
        onSortModelChange={(sort) =>setSortModel(sort) }
      />
    </Box>
  );
};
