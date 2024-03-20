import { useEffect, useState } from "react";
import { PrjStageStatus } from "../../models/PrjStageStatus";
import { ApiResponse } from "../../models/ApiResponse";
import api from "../../services/ApiService";
import { SettingGrid } from "./SettingGrid";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import Stack from "@mui/material/Stack/Stack";
import Chip from "@mui/material/Chip/Chip";

export default function ProjectStageStatusSetting() {
  const ProjectStageStatusGridColumns: GridColDef[] = [
    { field: "id", headerName: "Id", width: 70 },
    { field: "description", headerName: "Stage", width: 150 },
    {
      field: "statuses",
      headerName: "Status",
      type: "Array",
      width: 500,
      renderCell: (params: any) => {
        if (!params.value) {
          return params.value;
        } else {
          return params?.row?.statuses.map((item: any) => {
            return (
              <Stack direction="row" key={item.id} spacing={1}>
                <Chip label={item.description} />
              </Stack>
            );
          });
        }
      },
    },
    { field: "isActive", headerName: "isActive" },
    { field: "updatedDate", headerName: "UpdatedDate", width: 250 },
  ];

  const [stageStatus, setStageStatus] = useState<PrjStageStatus[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const getStageStatusResponse = await api.get<
        ApiResponse<PrjStageStatus[]>
      >("/Picklist/project-stage-stauses-list");
      setStageStatus(getStageStatusResponse?.data || []);
    };

    fetchData();
  }, []);
  return (
    <>
      <SettingGrid
        data={stageStatus}
        column={ProjectStageStatusGridColumns}
        sortByField="id"
        sortByOrder="desc"
      />
    </>
  );
}
