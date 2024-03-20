import { useEffect, useState } from "react";
import { Category } from "../../../models/Category";
import { ApiResponse } from "../../../models/ApiResponse";
import { SettingGrid } from "../../../components/ManageSettingComponents/SettingGrid";
import api from "../../../services/ApiService";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import moment from "moment";
import { Button, Switch } from "@mui/material";
import { toast } from "react-toastify";
import { SessionDetails } from "../../../models/SessionDetails";
import CategoryModal from "./CategoryModal";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Delete, Edit } from "@mui/icons-material";
import DeleteValidationModal from "../../../components/ManageSettingComponents/DeleteValidationModal";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function CategorySetting() {
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updatedRows, setUpdatedRows] = useState(null);

  const CategoryGridCollumns: GridColDef[] = [
    { field: "id", headerName: "Id", width: 100 },
    { field: "description", headerName: "Category Name", width: 300 },
    { field: "sort", headerName: "Sort", width: 100 },
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
              await updateCategoryActive(params.row, e.target.checked);
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
          onClick={() => handleShowDeleteModal(params)}
        />,
      ],
    },
  ];

  useEffect(() => {
    fetchData();
  }, [updatedRows]);

  const fetchData = async () => {
    const getCategoryResponse = await api.get<ApiResponse<Category[]>>(
      "/Picklist/categories"
    );
    setCategoryList(getCategoryResponse?.data || []);
  };

  const handleEditClickOpen = (gridParams: any) => {
    setShowAddUpdateModal(true);
    formik.setValues({ ...gridParams.row });
  };

  const handleShowDeleteModal = (gridParams: any) => {
    setDeleteModalOpen(true);
    formik.setValues({ ...gridParams.row });
  };

  const handleCloseModal = () => {
    setShowAddUpdateModal(false);
    setDeleteModalOpen(false);
    formik.resetForm();
  };

  const updateCategoryActive = async (row: Category, isActive: boolean) => {
    row.isActive = isActive;
    try {
      api
        .put<ApiResponse<number>>("/Picklist/category", row)
        .then(async (response: any) => {
          if (response.isSuccess) {
            setUpdatedRows(response);
            toast.success(response.message);
          } else {
            throw new Error(response.message);
          }
        })
        .catch((error: any) => {
          console.log("Exception from category", error);
        });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const deleteSubmit = () => {
    try {
      api
        .delete<ApiResponse<SessionDetails>>(
          `/Picklist/category/${formik.values.id}`
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
          console.log("Exception from category", error);
        });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      id: 0,
      sort: 0,
      description: "",
      isActive: true,
    },
    validationSchema: Yup.object({
      description: Yup.string()
        .required("Category Name is required")
        .min(1, "Category Name must be at least 1 characters")
        .max(40, "Category Name must be at most 40 characters")
        .test(
          "check-category-duplicate",
          "Category Name already exists",
          function async(value) {
            return new Promise((resolve) => {
              const categoryDuplicate = categoryList.some(
                (item) =>
                  item.description.trim().toLowerCase() ===
                    value.trim().toLowerCase() && item.id !== formik.values.id
              );
              categoryDuplicate ? resolve(false) : resolve(true);
            });
          }
        ),
      sort: Yup.number()
        .required("Sort is required")
        .min(1, "Sort must be greater than 0")
        .test(
          "check-sort-duplicate",
          "Sort already exists",
          function async(value) {
            return new Promise((resolve) => {
              const sortDuplicate = categoryList.some(
                (item) => item.sort === value && item.id !== formik.values.id
              );
              sortDuplicate ? resolve(false) : resolve(true);
            });
          }
        ),
    }),
    onSubmit: async (value) => {
      try {
        if (value.id > 0) {
          api
            .put<ApiResponse<number>>("/Picklist/category", {
              id: value.id,
              sort: value.sort,
              description: value.description,
              isActive: JSON.parse(`${value.isActive}`),
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
              console.log("Exception from category", error);
            });
        } else {
          api
            .post<ApiResponse<number>>("/Picklist/category", {
              description: value.description,
              sort: value.sort,
              isActive: JSON.parse(`${value.isActive}`),
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
              console.log("Exception from category", error);
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
        <Button
          variant="contained"
          onClick={() => {
            setShowAddUpdateModal(true);
          }}
        >
          Add Category
        </Button>
        <CategoryModal
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
        data={categoryList}
        column={CategoryGridCollumns}
        sortByField="id"
        sortByOrder="desc"
      />
    </>
  );
}
