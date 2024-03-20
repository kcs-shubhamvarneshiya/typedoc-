import { useEffect, useState } from "react";
import { ApiResponse } from "../../models/ApiResponse";
import { AttachmentType } from "../../models/AttachmentType";
import api from "../../services/ApiService";
import { SettingGrid } from "./SettingGrid";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import moment from "moment";
import { Switch } from "@mui/material";
import { toast } from "react-toastify";
import { SessionDetails } from "../../models/SessionDetails";

export default function AttachmentTypeSetting() {
  const [attachment, setAttachment] = useState<AttachmentType[]>([]);
  const [updatedRows, setUpdatedRows] = useState([]);

  const AttatchmentTypeGridCollumns: GridColDef[] = [
    { field: "id", headerName: "Id", width: 70 },
    { field: "attachType", headerName: "Attach Type", width: 250 },
    { field: "family", headerName: "Family", width: 100 },
    { field: "item", headerName: "Item", width: 100 },
    { field: "prefix", headerName: "Prefix", width: 100 },
    { field: "lvl", headerName: "Lvl", width: 100 },
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
              updateAttchmentActive(params.row);
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
      const getAttachmentResponse = await api.get<
        ApiResponse<AttachmentType[]>
      >("/Picklist/attachment-types");
      setAttachment(getAttachmentResponse?.data || []);
    };

    fetchData();
  }, [updatedRows]);

  const updateAttchmentActive = ({
    id,
    attachType,
    family,
    item,
    prefix,
    lvl,
    isActive,
    updatedBy,
    updatedDate,
  }) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();

    const data = {
      id,
      attachType,
      family,
      item,
      prefix,
      lvl,
      isActive: !isActive,
      updatedBy,
      updatedDate: formattedDate,
    };

    try {
      api
        .put<ApiResponse<SessionDetails>>("/Picklist/attachment-type", data)
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
        data={attachment}
        column={AttatchmentTypeGridCollumns}
        sortByField="id"
        sortByOrder="desc"
      />
    </>
  );
}
