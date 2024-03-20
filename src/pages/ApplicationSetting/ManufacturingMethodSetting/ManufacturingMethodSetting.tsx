import { useEffect, useState } from "react";
import { ManufacturingMethod } from "../../../models/ManufacturingMethod";
import api from "../../../services/ApiService";
import { ApiResponse } from "../../../models/ApiResponse";
import { SettingGrid } from "../../../components/ManageSettingComponents/SettingGrid";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import moment from "moment";
import { Button, Switch } from "@mui/material";
import { toast } from "react-toastify";
import { SessionDetails } from "../../../models/SessionDetails";
import { GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { Delete } from "@mui/icons-material";
import ManufacturingModal from "./ManufacturingModal";
import DeleteValidationModal from "../../../components/ManageSettingComponents/DeleteValidationModal";
import { useFormik } from "formik";
import * as Yup from "yup";
/**
 * @author Shubham Varneshiya
 * This code snippet defines a React component called ManufactoryMethodSetting,
 * which manages a list of manufacturing methods. 
 * It fetches data from an API endpoint, displays the data in a grid, allows editing and deleting of entries, and provides form validation for adding and updating methods. The component also includes modals for adding, editing, and deleting methods.
 */
export default function ManufactoryMethodSetting() {
  const [manufacturingMethodList, setManufacturingMethodList] = useState<
    ManufacturingMethod[]
  >([]);

  const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateRows, setUpdateRows] = useState([]);

  const ManufacturingMethodGridCollumns: GridColDef[] = [
    { field: "id", headerName: "Id", width: 70 },
    { field: "method", headerName: "Manufacturing Method", width: 250 },
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
              await updateManufacturingMethodActive(
                params.row,
                e.target.checked
              );
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
          icon={<EditIcon />}
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
  }, [updateRows]);

  const fetchData = async () => {
    const getManufacturingMethodResponse = await api.get<
      ApiResponse<ManufacturingMethod[]>
    >("/Picklist/manufacturing-methods");
    setManufacturingMethodList(getManufacturingMethodResponse?.data || []);
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

  const updateManufacturingMethodActive = async (
    row: ManufacturingMethod,
    isAcitve: boolean
  ) => {
    row.isActive = isAcitve;
    try {
      api
        .put<ApiResponse<number>>("/Picklist/manufacturing-method", row)
        .then(async (response: any) => {
          if (response.isSuccess) {
            setUpdateRows(response);
            toast.success(response.message);
          } else {
            throw new Error(response.message);
          }
        })
        .catch((error: any) => {
          console.log("Exception from manufacturing method", error);
        });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const deleteSubmit = () => {
    try {
      api
        .delete<ApiResponse<SessionDetails>>(
          `/Picklist/manufacturing-method/${formik.values.id}`
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
          console.log("Exception from manufacturing method", error);
        });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      id: 0,
      method: "",
      isActive: true,
    },
    validationSchema: Yup.object({
      method: Yup.string()
        .required("Method is required")
        .min(1, "Method must be at least 1 characters")
        .max(40, "Method must be at most 40 characters")
        .test(
          "check-duplicate",
          "Method already exists",
          function async(value) {
            return new Promise((resolve) => {
              const isDuplicate = manufacturingMethodList.some(
                (item) =>
                  item.method.trim().toLowerCase() ===
                    value.trim().toLowerCase() && item.id !== formik.values.id
              );
              isDuplicate ? resolve(false) : resolve(true);
            });
          }
        ),
    }),
    onSubmit: async (formData) => {
      try {
        if (formData.id > 0) {
          api
            .put<ApiResponse<number>>("/Picklist/manufacturing-method", {
              id: formData.id,
              method: formData.method,
              isActive: JSON.parse(`${formData.isActive}`),
            })
            .then(async (response: any) => {
              if (response.isSuccess) {
                setShowAddUpdateModal(false);
                setUpdateRows(response);
                formik.resetForm();
                toast.success(response.message);
              } else {
                throw new Error(response.message);
              }
            })
            .catch((error: any) => {
              console.log("Exception from manufacturing method", error);
            });
        } else {
          api
            .post<ApiResponse<number>>("/Picklist/manufacturing-method", {
              method: formData.method,
              isActive: JSON.parse(`${formData.isActive}`),
            })
            .then(async (response: any) => {
              if (response.isSuccess) {
                setShowAddUpdateModal(false);
                setUpdateRows(response);
                formik.resetForm();
                toast.success(response.message);
              } else {
                throw new Error(response.message);
              }
            })
            .catch((error: any) => {
              console.log("Exception from manufacturing method", error);
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
          Add Method
        </Button>

        <ManufacturingModal
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
        data={manufacturingMethodList}
        column={ManufacturingMethodGridCollumns}
        sortByField="id"
        sortByOrder="desc"
      />
    </>
  );
}
