import { useEffect, useState } from "react";
import { ApiResponse } from "../../models/ApiResponse";
import { FactStatus } from "../../models/FactStatus";
import api from "../../services/ApiService";
import { SettingGrid } from "./SettingGrid";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import moment from "moment";
import { Switch } from "@mui/material";
import { toast } from "react-toastify";

export default function FactoryStatusSetting() {
  const [factStatus, setFactStatus] = useState<FactStatus[]>([]);
  const [updatedRows, setUpdatedRows] = useState([]);

  const FactStatusGridColumns: GridColDef[] = [
    { field: "id", headerName: "Id", width: 70 },
    { field: "description", headerName: "Description", width: 160 },
    {
      field: "isActive",
      headerName: "isActive",
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
            color="primary"
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
      const getFactStatusResponse = await api.get<ApiResponse<FactStatus[]>>(
        "/Picklist/factory-statuses"
      );
      setFactStatus(getFactStatusResponse?.data || []);
    };

    fetchData();
  }, [updatedRows]);

  const updateStatusActive = ({
    id,
    description,
    isActive,
    updatedBy,
    updatedDate,
  }) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();

    const data = {
      id,
      description,
      isActive: !isActive,
      updatedBy: 1,
      updatedDate: formattedDate,
    };

    try {
      api
        .put<ApiResponse<FactStatus>>("/Picklist/factory-status", data)
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
        data={factStatus}
        column={FactStatusGridColumns}
        sortByField="id"
        sortByOrder="desc"
      />
    </>
  );
}
