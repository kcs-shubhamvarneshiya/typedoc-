import { useEffect, useState } from "react";
import { HTSMaterialDetail } from "../../../models/HTSMaterialDetail";
import { SettingGrid } from "../../../components/ManageSettingComponents/SettingGrid";
import api from "../../../services/ApiService";
import { ApiResponse } from "../../../models/ApiResponse";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import moment from "moment";
import { Button, Switch } from "@mui/material";
import { toast } from "react-toastify";
import HTSDetailModal from "./HTSDetailModal";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Delete, Edit } from "@mui/icons-material";
import DeleteValidationModal from "../../../components/ManageSettingComponents/DeleteValidationModal";
import { SessionDetails } from "../../../models/SessionDetails";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function HTSDetailSetting() {
  const [htsMaterialDetailList, setHTSMaterialDetailList] = useState<
    HTSMaterialDetail[]
  >([]);
  const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateRows, setUpdateRows] = useState(null);

  const HTSMaterialDetailGridCollumns: GridColDef[] = [
    { field: "id", headerName: "Id", width: 100 },
    { field: "description", headerName: "HTS Material Detail", width: 300 },
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
              await updateHTSDetail(params.row, e.target.checked);
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
          onClick={() => handleDeleteModalOpen(params)}
        />,
      ],
    },
  ];

  useEffect(() => {
    fetchData();
  }, [updateRows]);

  const fetchData = async () => {
    const getHTSMaterialDetailRepsonse = await api.get<
      ApiResponse<HTSMaterialDetail[]>
    >("/Picklist/hts-material-details");
    setHTSMaterialDetailList(getHTSMaterialDetailRepsonse?.data || []);
  };

  const handleEditClickOpen = (gridParams: any) => {
    setShowAddUpdateModal(true);
    formik.setValues({ ...gridParams.row });
  };

  const handleDeleteModalOpen = (gridParams: any) => {
    setDeleteModalOpen(true);
    formik.setValues({ ...gridParams.row });
  };

  const handleCloseModal = () => {
    setShowAddUpdateModal(false);
    setDeleteModalOpen(false);
    formik.resetForm();
  };

  const updateHTSDetail = async (row: HTSMaterialDetail, isActive: boolean) => {
    row.isActive = isActive;
    try {
      api
        .put<ApiResponse<number>>("/Picklist/hts-material-detail", row)
        .then(async (response: any) => {
          if (response.isSuccess) {
            setUpdateRows(response);
            toast.success(response.message);
          } else {
            throw new Error(response.message);
          }
        })
        .catch((error: any) => {
          console.log("Exception from hts material detail", error);
        });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const deleteSubmit = () => {
    try {
      api
        .delete<ApiResponse<SessionDetails>>(
          `/Picklist/hts-material-detail/${formik.values.id}`
        )
        .then(async (response: any) => {
          if (response.isSuccess) {
            setDeleteModalOpen(false);
            setUpdateRows(response);
            formik.resetForm();
            toast.success(response.message);
          } else {
            throw new Error(response.message);
          }
        })
        .catch((error: any) => {
          console.log("Exception from hts material detail", error);
        });
    } catch (err: any) {
      toast.error(err.message);
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
        .required("HTS Material Detail is required")
        .min(1, "HTS Material Detail must be at least 1 characters")
        .max(40, "HTS Material Detail must be at most 40 characters")
        .test(
          "check-description-duplicate",
          "HTS Material Detail already exists",
          function async(value) {
            return new Promise((resolve) => {
              const isDescriptionDuplicate = htsMaterialDetailList.some(
                (item) =>
                  item.description.trim().toLowerCase() ===
                    value.trim().toLowerCase() && item.id !== formik.values.id
              );
              isDescriptionDuplicate ? resolve(false) : resolve(true);
            });
          }
        ),
    }),
    onSubmit: (values) => {
      try {
        if (values.id > 0) {
          api
            .put<ApiResponse<number>>("/Picklist/hts-material-detail", {
              id: values.id,
              description: values.description,
              isActive: JSON.parse(`${values.isActive}`),
            })
            .then(async (response: any) => {
              if (response.isSuccess) {
                setShowAddUpdateModal(false);
                setUpdateRows(response);
                formik.resetForm();
              } else {
                throw new Error(response.message);
              }
            })
            .catch((err: any) => {
              console.log("Exception from hts material detail", err);
            });
        } else {
          api
            .post<ApiResponse<number>>("/Picklist/hts-material-detail", {
              description: values.description,
              isActive: JSON.parse(`${values.isActive}`),
            })
            .then(async (response: any) => {
              if (response.isSuccess) {
                setShowAddUpdateModal(false);
                setUpdateRows(response);
                formik.resetForm();
              } else {
                throw new Error(response.message);
              }
            })
            .catch((err: any) => {
              console.log("Exception from hts material detail", err);
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
          Add HTS Material Detail
        </Button>
        <HTSDetailModal
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
        data={htsMaterialDetailList}
        column={HTSMaterialDetailGridCollumns}
        sortByField="id"
        sortByOrder="desc"
      />
    </>
  );
}
