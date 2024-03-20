import { useEffect, useState } from "react";
import { DesignerMkt } from "../../models/DesignerMkt";
import { ApiResponse } from "../../models/ApiResponse";
import api from "../../services/ApiService";
import { SettingGrid } from "./SettingGrid";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import moment from "moment";
import { Switch } from "@mui/material";
import { toast } from "react-toastify";

export default function MarketingDesignerSetting() {
  const [marketingDesigner, setMarketingDesigner] = useState<DesignerMkt[]>([]);
  const [updatedRows, setUpdatedRows] = useState([]);

  const MarketingDesignerGridCollumns: GridColDef[] = [
    { field: "id", headerName: "Id", width: 70 },
    { field: "designer", headerName: "Designer Name", width: 200 },
    { field: "prefix", headerName: "Prefix" },
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
              updateMarketingActive(params.row);
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
      const getDesignerMktResponse = await api.get<ApiResponse<DesignerMkt[]>>(
        "/Picklist/designer-mkts"
      );
      setMarketingDesigner(getDesignerMktResponse?.data || []);
    };

    fetchData();
  }, [updatedRows]);

  const updateMarketingActive = ({
    id,
    designer,
    prefix,
    isActive,
    updatedBy,
    updatedDate,
  }) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
    const data = {
      id,
      designer,
      prefix,
      isActive: !isActive,
      updatedBy,
      updatedDate: formattedDate,
    };

    try {
      api
        .put<ApiResponse<DesignerMkt>>("/Picklist/designer-mkt", data)
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
        data={marketingDesigner}
        column={MarketingDesignerGridCollumns}
        sortByField="id"
        sortByOrder="desc"
      />
    </>
  );
}
