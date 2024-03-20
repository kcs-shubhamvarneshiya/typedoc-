import { useEffect, useState } from "react";
import { Supplier } from "../../models/Supplier";
import { ApiResponse } from "../../models/ApiResponse";
import api from "../../services/ApiService";
import { SettingGrid } from "./SettingGrid";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import moment from "moment";
import { Switch } from "@mui/material";
import { toast } from "react-toastify";

export default function SupplierSetting() {
  const [supplier, setSupplier] = useState<Supplier[]>([]);
  const [updatedRows, setUpdatedRows] = useState([]);

  const SupplierGridCollumns: GridColDef[] = [
    { field: "id", headerName: "Id", width: 70 },
    { field: "name", headerName: "Supplier Name", width: 200 },
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
              updateSupplierActive(params.row);
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
      const getSupplierResponse = await api.get<ApiResponse<Supplier[]>>(
        "/Picklist/suppliers"
      );
      setSupplier(getSupplierResponse?.data || []);
    };

    fetchData();
  }, [updatedRows]);

  const updateSupplierActive = ({
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
        .put<ApiResponse<Supplier>>("/Picklist/supplier", data)
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
        data={supplier}
        column={SupplierGridCollumns}
        sortByField="id"
        sortByOrder="desc"
      />
    </>
  );
}
