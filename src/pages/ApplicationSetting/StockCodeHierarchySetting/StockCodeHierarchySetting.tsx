import { useEffect, useState } from "react";
import { StockCodeHierachy } from "../../../models/StockCodeHierarchy";
import api from "../../../services/ApiService";
import { ApiResponse } from "../../../models/ApiResponse";
import { SettingGrid } from "../../../components/ManageSettingComponents/SettingGrid";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import moment from "moment";
import { Button, Switch } from "@mui/material";
import { toast } from "react-toastify";
import StockCodeModal from "./StockCodeModal";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Delete, Edit } from "@mui/icons-material";
import DeleteValidationModal from "../../../components/ManageSettingComponents/DeleteValidationModal";
import { SessionDetails } from "../../../models/SessionDetails";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function StockCodeHierarchySetting() {
  const [stockCodeHierarchiesList, setStockCodeHierarchiesList] = useState<
    StockCodeHierachy[]
  >([]);
  const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateRows, setUpdateRows] = useState(null);

  const StockCodeHierachyGridCollumns: GridColDef[] = [
    { field: "id", headerName: "Id", width: 100 },
    { field: "rank", headerName: "Rank", width: 200 },
    { field: "attachType", headerName: "Attach Type", width: 300 },
    {
      field: "isActive",
      headerName: "isActive",
      width: 200,
      renderCell: (params: any) => (
        <>
          <Switch
            checked={params.value}
            onChange={async (e) => {
              await updateStockCodeActive(params.row, e.target.checked);
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
      width: 100,
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
    const getStockCodeHierarchyResponse = await api.get<
      ApiResponse<StockCodeHierachy[]>
    >("/Picklist/stockcode-hierarchies");
    setStockCodeHierarchiesList(getStockCodeHierarchyResponse?.data || []);
  };

  const handleEditClickOpen = (gridParams: any) => {
    setShowAddUpdateModal(true);
    formik.setValues({ ...gridParams.row });
  };

  const handleDeleteModalOpen = (gridParams) => {
    setDeleteModalOpen(true);
    formik.setValues({ ...gridParams.row });
  };

  const handleCloseModal = () => {
    setShowAddUpdateModal(false);
    setDeleteModalOpen(false);
    formik.resetForm();
  };

  const updateStockCodeActive = async (
    row: StockCodeHierachy,
    isActive: boolean
  ) => {
    row.isActive = isActive;
    try {
      api
        .put<ApiResponse<number>>("/Picklist/stockcode-hierarchy", row)
        .then(async (response: any) => {
          if (response.isSuccess) {
            setUpdateRows(response);
            toast.success(response.message);
          } else {
            throw new Error(response.message);
          }
        })
        .catch((error: any) => {
          console.log("Exception from stockcode hierarchy", error);
        });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const deleteSubmit = () => {
    try {
      api
        .delete<ApiResponse<SessionDetails>>(
          `/Picklist/stockcode-hierarchy/${formik.values.id}`
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
          console.log("Exception from stockcode hierarchy", error);
        });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      id: 0,
      rank: 0,
      attachType: "",
      isActive: true,
    },
    validationSchema: Yup.object({
      rank: Yup.number()
        .required("Rank is required")
        .min(1, "Rank must be greater than 0")
        .test(
          "check-rank-duplicate",
          "Rank already exists",
          function async(value) {
            return new Promise((resolve) => {
              const isRankDuplicate = stockCodeHierarchiesList.some(
                (item) => item.rank === value && item.id !== formik.values.id
              );
              isRankDuplicate ? resolve(false) : resolve(true);
            });
          }
        ),
      attachType: Yup.string()
        .required("Attach type Required")
        .min(1, "Attach type must be at least 1 characters")
        .max(40, "Attach type must be at most 40 characters")
        .test(
          "check-attach-type",
          "Attach type already exists",
          function async(value) {
            return new Promise((resolve) => {
              const isAttachTypeDuplicate = stockCodeHierarchiesList.some(
                (item) =>
                  item.attachType.trim().toLowerCase() ===
                    value.trim().toLowerCase() && item.id !== formik.values.id
              );
              isAttachTypeDuplicate ? resolve(false) : resolve(true);
            });
          }
        ),
    }),
    onSubmit: async (values) => {
      try {
        if (values.id > 0) {
          api
            .put<ApiResponse<number>>("/Picklist/stockcode-hierarchy", {
              id: formik.values.id,
              rank: formik.values.rank,
              attachType: formik.values.attachType,
              isActive: JSON.parse(`${formik.values.isActive}`),
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
              console.log("Exception from stockcode hierarchy", error);
            });
        } else {
          api
            .post<ApiResponse<number>>("/Picklist/stockcode-hierarchy", {
              rank: formik.values.rank,
              attachType: formik.values.attachType,
              isActive: JSON.parse(`${formik.values.isActive}`),
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
              console.log("Exception from stockcode hierarchy", error);
            });
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    },
  });

  return (
    <>
      <div>
        <Button variant="contained" onClick={() => setShowAddUpdateModal(true)}>
          Add Attach Type
        </Button>
        <StockCodeModal
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
        data={stockCodeHierarchiesList}
        column={StockCodeHierachyGridCollumns}
        sortByField="id"
        sortByOrder="desc"
      />
    </>
  );
}
