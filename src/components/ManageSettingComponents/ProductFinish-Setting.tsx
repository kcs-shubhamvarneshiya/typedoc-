import { useEffect, useState } from "react";
import { FixtureFinish } from "../../models/FixtureFinish";
import { ApiResponse } from "../../models/ApiResponse";
import api from "../../services/ApiService";
import { SettingGrid } from "./SettingGrid";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import moment from "moment";
import { Switch } from "@mui/material";
import { toast } from "react-toastify";

export default function ProductFinishSetting() {
  const [finish, setFinish] = useState<FixtureFinish[]>([]);
  const [updatedRows, setUpdatedRows] = useState([]);

  const ProductFinishGridCollumns: GridColDef[] = [
    { field: "id", headerName: "Id", width: 70 },
    { field: "finishCode", headerName: "Finish Code" },
    { field: "finishName", headerName: "Finish Name", width: 235 },
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
              updateFinishActive(params.row);
            }}
            color={"primary"}
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
      const getFinishResponse = await api.get<ApiResponse<FixtureFinish[]>>(
        "/Picklist/finishes"
      );
      setFinish(getFinishResponse?.data || []);
    };

    fetchData();
  }, [updatedRows]);

  const updateFinishActive = ({
    id,
    finishCode,
    finishName,
    isActive,
    updatedBy,
    updatedDate,
  }) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();

    const data = {
      id,
      finishCode,
      finishName,
      isActive: !isActive,
      updatedBy,
      updatedDate: formattedDate,
    };

    try {
      api
        .put<ApiResponse<FixtureFinish>>("/Picklist/finish", data)
        .then((response: any) => {
          if (response.isSuccess) {
            setUpdatedRows(response);
            toast.success(response.message);
          } else {
            throw new Error(response.message);
          }
        })
        .catch((error: any) => {
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
        data={finish}
        column={ProductFinishGridCollumns}
        sortByField="id"
        sortByOrder="desc"
      />
    </>
  );
}
