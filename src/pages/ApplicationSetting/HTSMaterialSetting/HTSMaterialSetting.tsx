import { useEffect, useState } from "react";
import { HTSMaterial } from "../../../models/HTSMaterial";
import { SettingGrid } from "../../../components/ManageSettingComponents/SettingGrid";
import api from "../../../services/ApiService";
import { ApiResponse } from "../../../models/ApiResponse";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import moment from "moment";
import { Button, Switch } from "@mui/material";
import { toast } from "react-toastify";
import HTSMaterialModal from "./HTSMaterialModal";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Delete, Edit } from "@mui/icons-material";
import DeleteValidationModal from "../../../components/ManageSettingComponents/DeleteValidationModal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { error } from "console";
import { SessionDetails } from "../../../models/SessionDetails";

export default function HTSMaterialSetting() {
  const [htsMaterialList, setHTSMaterialList] = useState<HTSMaterial[]>([]);
  const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updatedRows, setUpdatedRows] = useState([]);

  const HTSMaterialGridCollumns: GridColDef[] = [
    { field: "id", headerName: "Id", width: 100 },
    { field: "description", headerName: "HTS Material", width: 300 },
    {
      field: "isActive",
      headerName: "isActive",
      sortable: false,
      width: 200,
      renderCell: (params: any) => (
        <>
          <Switch
            checked={params.value}
            onChange={async (e) => {
              await updateHTSMaterialActive(params.row, e.target.checked);
            }}
            color={"primary"}
            inputProps={{ "aria-label": "controlled" }}
          />
        </>
      ),
    },
    {
      field: "updatedDate",
      headerName: "UpdatedDate",
      width: 200,
      valueFormatter: (params) => moment(params?.value).format("YYYY-MM-DD"),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 200,
      getActions: (params: any) => [
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          onClick={() => handleEditClickOpen(params)}
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          onClick={() => handleDeleteClickOpen(params)}
        />,
      ],
    },
  ];

  useEffect(() => {
    fetchData();
  }, [updatedRows]);

  const fetchData = async () => {
    const getHTSMaterialRepsonse = await api.get<ApiResponse<HTSMaterial[]>>(
      "/Picklist/hts-materials"
    );
    setHTSMaterialList(getHTSMaterialRepsonse?.data || []);
  };

  const handleEditClickOpen = (gridParams: any) => {
    setShowAddUpdateModal(true);
    formik.setValues({ ...gridParams.row });
  };

  const handleDeleteClickOpen = (gridParams: any) => {
    setDeleteModalOpen(true);
    formik.setValues({ ...gridParams.row });
  };

  const handleCloseModal = () => {
    setShowAddUpdateModal(false);
    setDeleteModalOpen(false);
    formik.resetForm();
  };

  const updateHTSMaterialActive = async (
    row: HTSMaterial,
    isActive: boolean
  ) => {
    row.isActive = isActive;
    try {
      api
        .put<ApiResponse<HTSMaterial>>("/Picklist/hts-material", row)
        .then(async (response: any) => {
          if (response.isSuccess) {
            setUpdatedRows(response);
            toast.success(response.message);
          } else {
            throw new Error(response.message);
          }
        })
        .catch((error: any) => {
          toast.error(error.message);
        });
    } catch (err: any) {
      console.log("Exception from hts material", err);
    }
  };

  const deleteSubmit = () => {
    try {
      api
        .delete<ApiResponse<SessionDetails>>(
          `/Picklist/hts-material/${formik.values.id}`
        )
        .then(async (response: any) => {
          if (response.isSuccess) {
            setDeleteModalOpen(false);
            setUpdatedRows(response);
            formik.resetForm();
            toast.success(response.message);
          } else {
            throw new Error(response.message);
          }
        })
        .catch((error: any) => {
          toast.error(error.message);
        });
    } catch (err: any) {
      console.log("Exception from hts material", err);
    }
  };

  const formik = useFormik({
    initialValues: {
      id: 0,
      description: "",
      isActive: true,
    },
    validationSchema: Yup.object({
      description: Yup.string()
        .required("HTS Material is required")
        .min(1, "HTS Material must be at least 1 characters")
        .max(40, "HTS Material must be at most 40 characters")
        .test(
          "check-description-duplicate",
          "HTS Material already exists",
          function async(value) {
            return new Promise((resolve) => {
              const descriptionDuplicate = htsMaterialList.some(
                (item) =>
                  item.description.trim().toLowerCase() ===
                    value.trim().toLowerCase() && item.id !== formik.values.id
              );
              descriptionDuplicate ? resolve(false) : resolve(true);
            });
          }
        ),
    }),
    onSubmit: (values) => {
      try {
        if (values.id > 0) {
          api
            .put<ApiResponse<number>>("/Picklist/hts-material", {
              id: values.id,
              description: values.description,
              isActive: JSON.parse(`${values.isActive}`),
            })
            .then(async (response: any) => {
              if (response.isSuccess) {
                setShowAddUpdateModal(false);
                setUpdatedRows(response);
                formik.resetForm();
                toast.success(response.message);
              } else {
                throw new Error(response.message);
              }
            })
            .catch((error: any) => {
              console.log("Exception from hts material", error);
            });
        } else {
          api
            .post<ApiResponse<number>>("/Picklist/hts-material", {
              description: values.description,
              isActive: JSON.parse(`${values.isActive}`),
            })
            .then(async (response: any) => {
              if (response.isSuccess) {
                setShowAddUpdateModal(false);
                setUpdatedRows(response);
                formik.resetForm();
                toast.success(response.message);
              } else {
                throw new Error(response.message);
              }
            })
            .catch((error: any) => {
              console.log("Exception from hts material", error);
            });
        }
      } catch (err: any) {
        toast.error(err.message);
      }
    },
  });

  return (
    <>
      <div>
        <Button variant="contained" onClick={() => setShowAddUpdateModal(true)}>
          Add HTS Material
        </Button>
        <HTSMaterialModal
          isOpen={showAddUpdateModal}
          onClose={handleCloseModal}
          formik={formik}
        />
        <DeleteValidationModal
          addModalOpen={deleteModalOpen}
          handleCloseModal={handleCloseModal}
          deleteSubmit={deleteSubmit}
        />
      </div>
      <SettingGrid
        data={htsMaterialList}
        column={HTSMaterialGridCollumns}
        sortByField="id"
        sortByOrder="desc"
      />
    </>
  );
}
