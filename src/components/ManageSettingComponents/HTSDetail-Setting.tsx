import { useEffect, useState } from "react";
import { HTSMaterialDetail } from "../../models/HTSMaterialDetail";
import { SettingGrid } from "./SettingGrid";
import api from "../../services/ApiService";
import { ApiResponse } from "../../models/ApiResponse";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import moment from "moment";
import { Switch } from "@mui/material";
import { toast } from "react-toastify";

export default function HTSDetailSetting() {
  const [htsMaterialDetail, setHTSMaterialDetail] = useState<
    HTSMaterialDetail[]
  >([]);
  const [updatedRows, setUpdatedRows] = useState([]);

  const HTSMaterialDetailGridCollumns: GridColDef[] = [
    { field: "id", headerName: "Id", width: 70 },
    { field: "description", headerName: "HTS Material Detail", width: 150 },
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
              updateHTSDetail(params.row);
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
      const getHTSMaterialDetailRepsonse = await api.get<
        ApiResponse<HTSMaterialDetail[]>
      >("/Picklist/hts-material-details");
      setHTSMaterialDetail(getHTSMaterialDetailRepsonse?.data || []);
    };
    fetchData();
  }, [updatedRows]);

  const updateHTSDetail = ({
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
        .put<ApiResponse<HTSMaterialDetail>>(
          "/Picklist/hts-material-detail",
          data
        )
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
        data={htsMaterialDetail}
        column={HTSMaterialDetailGridCollumns}
        sortByField="id"
        sortByOrder="desc"
      />
    </>
  );
}
