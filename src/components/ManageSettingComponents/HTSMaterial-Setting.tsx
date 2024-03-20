import { useEffect, useState } from "react";
import { HTSMaterial } from "../../models/HTSMaterial";
import { SettingGrid } from "./SettingGrid";
import api from "../../services/ApiService";
import { ApiResponse } from "../../models/ApiResponse";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import moment from "moment";
import { Switch } from "@mui/material";
import { toast } from "react-toastify";

export default function HTSMaterialSetting() {
  const [htsMaterial, setHTSMaterial] = useState<HTSMaterial[]>([]);
  const [updatedRows, setUpdatedRows] = useState([]);

  const HTSMaterialGridCollumns: GridColDef[] = [
    { field: "id", headerName: "Id", width: 70 },
    { field: "description", headerName: "HTS Material", width: 100 },
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
              updateHTSMaterialActive(params.row);
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
      const getHTSMaterialRepsonse = await api.get<ApiResponse<HTSMaterial[]>>(
        "/Picklist/hts-materials"
      );
      setHTSMaterial(getHTSMaterialRepsonse?.data || []);
    };
    fetchData();
  }, [updatedRows]);

  const updateHTSMaterialActive = ({
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
      updatedBy,
      updatedDate: formattedDate,
    };

    try {
      api
        .put<ApiResponse<HTSMaterial>>("/Picklist/hts-material", data)
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
        data={htsMaterial}
        column={HTSMaterialGridCollumns}
        sortByField="id"
        sortByOrder="desc"
      />
    </>
  );
}
