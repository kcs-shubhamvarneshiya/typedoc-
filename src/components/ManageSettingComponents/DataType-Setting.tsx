import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import { useEffect, useState } from "react";
import { DataFieldType } from "../../models/DataFieldType";
import api from "../../services/ApiService";
import { ApiResponse } from "../../models/ApiResponse";
import moment from "moment";
import { SettingGrid } from "./SettingGrid";
import Stack from "@mui/material/Stack/Stack";
import Chip from "@mui/material/Chip/Chip";

/**
 * This code defines a React component called `DataTypeSetting` that renders a setting grid with specific columns for data types. 
 * It fetches data on component mount using an API endpoint and displays the data in the grid.
 *
 * @return {JSX.Element} The rendered DataTypeSetting component.
 */
export default function DataTypeSetting() {
  const DataTypeGridCollumns: GridColDef[] = [
    { field: "id", headerName: "Id", width: 70 },
    { field: "field", headerName: "Field" },
    {
      field: "types",
      headerName: "Data Type",
      width: 200,
      renderCell: (params: any) => {
        if (!params.value) {
          return params.value;
        } else {
          return params?.row?.types.map((item: any) => {
            return (
              <Stack direction="row" key={item.id} spacing={1}>
                <Chip label={item.description} />
              </Stack>
            );
          });
        }
      },
    },

    { field: "isActive", headerName: "isActive" },
    { field: "updatedBy", headerName: "UpdatedBy" },
    {
      field: "updatedDate",
      headerName: "UpdatedDate",
      width: 100,
      valueFormatter: (params) => moment(params?.value).format("YYYY-MM-DD"),
    },
  ];

  const [dataFieldType, setDataFieldType] = useState<DataFieldType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const getDataFieldTypeResponse = await api.get<
        ApiResponse<DataFieldType[]>
      >("/Picklist/data-fields-types-list");
      setDataFieldType(getDataFieldTypeResponse?.data || []);
    };
    fetchData();
  }, []);

  return (
    <>
      <SettingGrid
        data={dataFieldType}
        column={DataTypeGridCollumns}
        sortByField="id"
        sortByOrder="desc"
      />
    </>
  );
}
