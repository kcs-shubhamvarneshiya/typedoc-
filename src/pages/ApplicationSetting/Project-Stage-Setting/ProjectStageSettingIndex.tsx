import { useEffect, useState } from "react";
import { ApiResponse } from "../../../models/ApiResponse";
import { PrjStage } from "../../../models/PrjStage";
import api from "../../../services/ApiService";
import { SettingGrid } from "../../../components/ManageSettingComponents/SettingGrid";
import { Switch, Typography, Button } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import moment from "moment";
import { GridActionsCellItem } from "@mui/x-data-grid/components/cell/GridActionsCellItem";
import { GridRowParams } from "@mui/x-data-grid/models/params/gridRowParams";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import ProjectStageModal from "./ProjectStageModal";
import { Delete } from "@mui/icons-material";
import DeleteValidationModal from "../../../components/ManageSettingComponents/DeleteValidationModal";

export default function ProjectStageSettingIndex() {
  const [stage, setStage] = useState<PrjStage[]>([]);
  const [updateRows, setUpdatedRows] = useState([]);
  const [editEnable, setEditEnable] = useState(false);
  const [name, setName] = useState("");
  const [family, setFamily] = useState("");
  const [item, setItem] = useState("");
  const [activity, setActivity] = useState("");
  const [isActiveChecked, setIsActiveChecked] = useState(true);
  const [editId, setEditId] = useState(null);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const ProjectStageGridColumns: GridColDef[] = [
    { field: "id", headerName: "Id", width: 70 },
    { field: "description", headerName: "Stage", width: 150 },
    { field: "family", headerName: "Family" },
    { field: "item", headerName: "Item" },
    { field: "activity", headerName: "Activity" },
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
              updateStageActive(params.row);
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
    {
      field: "actions",
      type: "actions",
      headerName: "Action",
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          onClick={() => handleEditClickOpen(params)}
          label="Edit"
        />,
        <GridActionsCellItem
          icon={<Delete />}
          onClick={() => handleDeleteModel(params)}
          label="Delete"
        />,
      ],
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const getStageResponse = await api.get<ApiResponse<PrjStage[]>>(
        "/Picklist/stages"
      );
      setStage(getStageResponse?.data || []);
    };
    fetchData();
  }, [updateRows]);

  const handleEditClickOpen = (editRow: any) => {
    setAddModalOpen(true);
    setEditEnable(true);
    setDeleteModalOpen(false);
    setEditId(editRow.id);
    setName(editRow.row.description);
    setFamily(editRow.row.family);
    setItem(editRow.row.item);
    setActivity(editRow.row.activity);
    setIsActiveChecked(editRow.row.isActive);
  };

  const handleDeleteModel = (row) => {
    setEditId(row.id);
    setDeleteModalOpen(true);
  };

  const handleOpenModal = () => {
    setAddModalOpen(true);
    setEditEnable(false);
    setDeleteModalOpen(false);
    setName("");
    setFamily("");
    setItem("");
    setActivity("");
  };

  const handleCloseModal = () => {
    setAddModalOpen(false);
    setDeleteModalOpen(false);
    setEditEnable(false);
    setDeleteModalOpen(false);
    setName("");
    setFamily("");
    setItem("");
    setActivity("");
    setIsActiveChecked(true);
  };

  const handleRadioChange = () => {
    setIsActiveChecked(!isActiveChecked);
  };

  const addNewSubmit = (event: any) => {
    event.preventDefault();

    if (name) {
      const data = {
        description: name,
        family: null || family,
        item: null || item,
        activity: activity,
        isActive: isActiveChecked,
      };

      try {
        api
          .post<ApiResponse<PrjStage>>("/Picklist/stage", data)
          .then((response: any) => {
            if (response.isSuccess) {
              console.log(response);
              setUpdatedRows([]);
              setAddModalOpen(false);
              toast.success(response.message);
            } else {
              throw new Error(response.message);
            }
          })
          .catch((error) => {
            console.log("Exception from stage", error);
          });
      } catch (err: any) {
        toast.error(err.message);
      }
    }
  };

  const updateStageActive = ({
    id,
    isActive,
    description,
    family,
    item,
    activity,
    updatedBy,
    updatedDate,
  }) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();

    const data = {
      id,
      description,
      family,
      item,
      activity,
      isActive: !isActive,
      updatedBy,
      updatedDate: formattedDate,
    };

    try {
      api
        .put<ApiResponse<PrjStage>>("/Picklist/stage", data)
        .then((response: any) => {
          if (response.isSuccess) {
            setUpdatedRows(response);
            toast.success(response.message);
          } else {
            throw new Error(response.message);
          }
        })
        .catch((error) => {
          console.log("Exception from stage", error);
        });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const editSubmit = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();

    const data = {
      id: editId,
      description: name,
      family: family,
      item: item,
      activity: activity,
      isActive: isActiveChecked,
      updatedBy: 21,
      updatedDate: formattedDate,
    };
    try {
      api
        .put<ApiResponse<PrjStage>>("/Picklist/stage", data)
        .then((response: any) => {
          if (response.isSuccess) {
            setUpdatedRows(response);
            toast.success(response.message);
            setName("");
            setFamily("");
            setItem("");
            setActivity("");
            setIsActiveChecked(isActiveChecked);
            setAddModalOpen(false);
            setEditId(null);
          } else {
            throw new Error(response.message);
          }
        })
        .catch((error) => {
          console.log("Exception from stage", error);
        });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const deleteSubmit = () => {
    try {
      api
        .delete<ApiResponse<PrjStage>>(`/Picklist/stage/${editId}`)
        .then((response: any) => {
          if (response.isSuccess) {
            setUpdatedRows([]);
            setDeleteModalOpen(false);
            toast.success(response.message);
          } else {
            throw new Error(response.message);
          }
        })
        .catch((error) => {
          console.log("Exception from stage", error);
        });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <div>
        <Button variant="contained" onClick={handleOpenModal}>
          Add Stage
        </Button>
        <ProjectStageModal
          addModalOpen={addModalOpen}
          handleCloseModal={handleCloseModal}
          editEnable={editEnable}
          editSubmit={editSubmit}
          addNewSubmit={addNewSubmit}
          name={name}
          setName={setName}
          family={family}
          setFamily={setFamily}
          item={item}
          setItem={setItem}
          activity={activity}
          setActivity={setActivity}
          isActiveChecked={isActiveChecked}
          handleRadioChange={handleRadioChange}
        />

        <DeleteValidationModal
          addModalOpen={deleteModalOpen}
          handleCloseModal={handleCloseModal}
          deleteSubmit={deleteSubmit}
        />
      </div>
      <SettingGrid
        data={stage}
        column={ProjectStageGridColumns}
        sortByField="id"
        sortByOrder="desc"
      />
    </>
  );
}
