import { useEffect, useState } from "react";
import { ApiResponse } from "../../models/ApiResponse";
import { PrjStatus } from "../../models/PrjStatus";
import api from "../../services/ApiService";
import { SettingGrid } from "./SettingGrid";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import moment from "moment";
import { Switch } from "@mui/material";
import { toast } from "react-toastify";

export default function ProjectStatusSetting() {
  const [status, setStatus] = useState<PrjStatus[]>([]);
  const [updatedRows, setUpdatedRows] = useState([]);

  const ProjectStatusGridColumns: GridColDef[] = [
    { field: "id", headerName: "Id", width: 70 },
    { field: "description", headerName: "Status", width: 170 },
    { field: "sort", headerName: "Sort" },
    { field: "Activity", headerName: "Activity" },
    {
      field: "isActive",
      headerName: "isActive",
      width: 130,
      renderCell: (params: any) => (
        <>
          <Switch
            checked={params.value}
            onChange={(e) => {
              params.api.setEditCellValue(
                { id: params.id, field: params.field },
                e.target.checked
              );
              updateStatusActive(params.row);
            }}
            color={"primary"}
            inputProps={{ "aria-label": "controlled" }}
          />
        </>
      ),
    },

    {
      field: "updatedDate",
      headerName: "UpdatedDate",
      width: 100,
      valueFormatter: (params) => moment(params?.value).format("YYYY-MM-DD"),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const getStatusResponse = await api.get<ApiResponse<PrjStatus[]>>(
        "/Picklist/statuses"
      );
      setStatus(getStatusResponse?.data || []);
    };

    fetchData();
  }, [updatedRows]);

  const updateStatusActive = ({
    id,
    isActive,
    description,
    sort,
    updatedBy,
    updatedDate,
  }) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();

    const data = {
      id,
      description,
      sort,
      isActive: !isActive,
      updatedBy,
      updatedDate: formattedDate,
    };
    try {
      api
        .put<ApiResponse<PrjStatus>>("/Picklist/status", data)
        .then((response: any) => {
          if (response.isSuccess) {
            setUpdatedRows(response);
            toast.success(response.message);
          } else {
            throw new Error(response.message);
          }
        })
        .catch((error) => {
          console.log("Exception from login", error);
          toast.error(error.message);
        });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <SettingGrid
        data={status}
        column={ProjectStatusGridColumns}
        sortByField="id"
        sortByOrder="desc"
      />
    </>
  );
}
