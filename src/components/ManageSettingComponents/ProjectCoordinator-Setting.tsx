import { useEffect, useState } from "react";
import { ApiResponse } from "../../models/ApiResponse";
import { Coordinator } from "../../models/Coordintator";
import api from "../../services/ApiService";
import { SettingGrid } from "./SettingGrid";
import moment from "moment";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import { Switch } from "@mui/material";
import { toast } from "react-toastify";

export default function ProjectCoordinatorSetting() {
  const [coordinator, setCoordinator] = useState<Coordinator[]>([]);
  const [updatedRows, setUpdatedRows] = useState([]);

  const CoordinatorGridColumns: GridColDef[] = [
    { field: "id", headerName: "Id", width: 70 },
    { field: "name", headerName: "Name", width: 200 },
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
              updateCoordinatorActive(params.row);
            }}
            color="primary"
            inputProps={{ "aria-label": "controlled" }}
          />
        </>
      ),
    },
    { field: "updatedBy", headerName: "UpdatedBy" },
    {
      field: "updatedDate",
      headerName: "UpdatedDate",
      width: 100,
      valueFormatter: (params) => moment(params?.value).format("YYYY-MM-DD"),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const getCoordinatorResponse = await api.get<ApiResponse<Coordinator[]>>(
        "/Picklist/coordinators"
      );
      setCoordinator(getCoordinatorResponse?.data || []);
    };

    fetchData();
  }, [updatedRows]);

  const updateCoordinatorActive = ({
    id,
    name,
    isActive,
    updatedBy,
    updatedDate,
  }) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();

    const data = {
      id,
      name,
      isActive: !isActive,
      updatedBy,
      updatedDate: formattedDate,
    };

    try {
      api
        .put<ApiResponse<Coordinator>>("/Picklist/coordinator", data)
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
        data={coordinator}
        column={CoordinatorGridColumns}
        sortByField="id"
        sortByOrder="desc"
      />
    </>
  );
}
