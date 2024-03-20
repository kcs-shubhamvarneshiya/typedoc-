import { useEffect, useState } from "react";
import { PrimaryMaterial } from "../../../models/PrimaryMaterial";
import api from "../../../services/ApiService";
import { ApiResponse } from "../../../models/ApiResponse";
import { SettingGrid } from "../../../components/ManageSettingComponents/SettingGrid";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import moment from "moment";
import { Button, Switch } from "@mui/material";
import { toast } from "react-toastify";
import PrimaryMaterialModal from "./PrimaryMaterialModal";
import DeleteValidationModal from "../../../components/ManageSettingComponents/DeleteValidationModal";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Delete, Edit } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { SessionDetails } from "../../../models/SessionDetails";

export default function PrimaryMaterialSetting() {
  const [primaryMaterialList, setPrimaryMaterialList] = useState<
    PrimaryMaterial[]
  >([]);
  const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updatedRows, setUpdatedRows] = useState([]);

  const PrimaryMaterialGridCollumns: GridColDef[] = [
    { field: "id", headerName: "Id", width: 100 },
    { field: "name", headerName: "Primary Material", width: 300 },
    {
      field: "isActive",
      headerName: "isActive",
      width: 200,
      sortable: false,
      renderCell: (params: any) => (
        <>
          <Switch
            checked={params.value}
            onChange={async (e) => {
              await updatePrimaryMaterialActive(params.row, e.target.checked);
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
      width: 150,
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
          onClick={() => showEditClickOpen(params)}
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          onClick={() => showDeleteModal(params)}
        />,
      ],
    },
  ];

  useEffect(() => {
    fetchData();
  }, [updatedRows]);

  const fetchData = async () => {
    const getPrimaryMaterialRepsonse = await api.get<
      ApiResponse<PrimaryMaterial[]>
    >("/Picklist/primary-materials");
    setPrimaryMaterialList(getPrimaryMaterialRepsonse?.data || []);
  };

  const showEditClickOpen = (gridParams: any) => {
    setShowAddUpdateModal(true);
    formik.setValues({ ...gridParams.row });
  };

  const showDeleteModal = (gridParams: any) => {
    setDeleteModalOpen(true);
    formik.setValues({ ...gridParams.row });
  };

  const handleCloseModal = () => {
    setShowAddUpdateModal(false);
    setDeleteModalOpen(false);
    formik.resetForm();
  };

  const updatePrimaryMaterialActive = (
    row: PrimaryMaterial,
    isActive: boolean
  ) => {
    row.isActive = isActive;
    try {
      api
        .put<ApiResponse<PrimaryMaterial>>("/Picklist/primary-material", row)
        .then(async (response: any) => {
          if (response.isSuccess) {
            setUpdatedRows(response);
            toast.success(response.message);
          } else {
            throw new Error(response.message);
          }
        })
        .catch((error: any) => {
          console.log("Exception from primary material", error);
        });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const deleteSubmit = () => {
    try {
      api
        .delete<ApiResponse<SessionDetails>>(
          `/Picklist/primary-material/${formik.values.id}`
        )
        .then(async (response: any) => {
          if (response.isSuccess) {
            setDeleteModalOpen(false);
            setUpdatedRows(response);
            toast.success(response.message);
            formik.resetForm();
          } else {
            throw new Error(response.message);
          }
        })
        .catch((error: any) => {
          console.log("Exception from primary material", error);
        });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      id: 0,
      name: "",
      isActive: true,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Primary Material is required")
        .min(1, "Primary Material must be at least 1 characters")
        .max(40, "Primary Material must be at most 40 characters")
        .test(
          "check-name-Duplicate",
          "Primary Material already exists",
          function async(value) {
            return new Promise((resolve) => {
              const nameDuplicate = primaryMaterialList.some(
                (item) =>
                  item.name.trim().toLowerCase() ===
                    value.trim().toLowerCase() && item.id !== formik.values.id
              );
              nameDuplicate ? resolve(false) : resolve(true);
            });
          }
        ),
    }),
    onSubmit: (values) => {
      try {
        if (values.id > 0) {
          api
            .put<ApiResponse<number>>("/Picklist/primary-material", {
              id: values.id,
              name: values.name,
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
              console.log("Exception from primary material", error);
            });
        } else {
          api
            .post<ApiResponse<number>>("/Picklist/primary-material", {
              name: values.name,
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
              console.log("Exception from primary material", error);
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
          Add Primary Material
        </Button>
        <PrimaryMaterialModal
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
        data={primaryMaterialList}
        column={PrimaryMaterialGridCollumns}
        sortByField="id"
        sortByOrder="desc"
      />
    </>
  );
}
