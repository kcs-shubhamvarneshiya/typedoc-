import { useEffect, useState } from "react";
import { ApiResponse } from "../../models/ApiResponse";
import { DesignerRyt } from "../../models/DesignerRyt";
import api from "../../services/ApiService";
import { SettingGrid } from "./SettingGrid";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import moment from "moment";
import { Switch } from "@mui/material";
import { toast } from "react-toastify";

export default function RoyaltyDesignerSetting() {
  const [royaltyDesigner, setRoyaltyDesigner] = useState<DesignerRyt[]>([]);
  const [updatedRows, setUpdatedRows] = useState([]);

  const RoyaltyDesignerGridColumns: GridColDef[] = [
    { field: "id", headerName: "Id", width: 70 },
    { field: "designer", headerName: "Designer Name", width: 200 },
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
              updateRoyaltyActive(params.row);
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
      const getDesignerRytResponse = await api.get<ApiResponse<DesignerRyt[]>>(
        "/Picklist/designer-ryts"
      );
      setRoyaltyDesigner(getDesignerRytResponse?.data || []);
    };

    fetchData();
  }, [updatedRows]);

  const updateRoyaltyActive = ({
    id,
    designer,
    isActive,
    updatedBy,
    updatedDate,
  }) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
    const data = {
      id,
      designer,
      isActive: !isActive,
      updatedBy,
      updatedDate: formattedDate,
    };

    try {
      api
        .put<ApiResponse<DesignerRyt>>("/Picklist/designer-ryt", data)
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
        data={royaltyDesigner}
        column={RoyaltyDesignerGridColumns}
        sortByField="id"
        sortByOrder="desc"
      />
    </>
  );
}
