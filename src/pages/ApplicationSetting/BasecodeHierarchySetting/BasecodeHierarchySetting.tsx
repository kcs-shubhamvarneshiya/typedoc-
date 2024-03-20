import { useEffect, useState } from "react";
import api from "../../../services/ApiService";
import { ApiResponse } from "../../../models/ApiResponse";
import { SettingGrid } from "../../../components/ManageSettingComponents/SettingGrid";
import { BaseCodeHierarchy } from "../../../models/BaseCodeHierarchy";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import moment from "moment";
import { Button, Switch } from "@mui/material";
import { toast } from "react-toastify";
import { SessionDetails } from "../../../models/SessionDetails";
import BaseCodeModal from "./BaseCodeModal";
import { GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { Delete } from "@mui/icons-material";
import DeleteValidationModal from "../../../components/ManageSettingComponents/DeleteValidationModal";
import { useFormik } from "formik";
import * as Yup from "yup";

/**
 * Renders the BaseCodeHierarchySetting component.
 */
export default function BaseCodeHierarchySetting() {
  const [baseCodeHierarchiesList, setBaseCodeHierarchiesList] = useState<
    BaseCodeHierarchy[]
  >([]);
  const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateRows, setUpdateRows] = useState([]);

  const BaseCodeHierarchyGridCollumns: GridColDef[] = [
    { field: "id", headerName: "Id", width: 100 },
    { field: "rank", headerName: "Rank", width: 200 },
    { field: "attachType", headerName: "Attach Type", width: 300 },
    {
      field: "isActive",
      headerName: "isActive",
      width: 200,
      sortable: false,
      /**
       * Renders a cell with a Switch component.
       *
       * @param {any} params - the parameters for rendering the cell
       * @return {JSX.Element} the rendered cell component
       */
      renderCell: (params: any) => (
        <>
          <Switch
            checked={params.value}
            onChange={async (e) => {
              await updateBaseCodeActive(params.row, e.target.checked);
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
      /**
       * A function that generates an array of GridActionsCellItem components based on the given params.
       *
       * @param {any} params - the parameters used to generate the GridActionsCellItem components
       * @return {Array} an array of GridActionsCellItem components
       */
      getActions: (params: any) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => showEditClickOpen(params)}
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          onClick={() => showDeleteModalOpen(params)}
        />,
      ],
    },
  ];

  useEffect(() => {
    fetchData();
  }, [updateRows]);

  /**
   * Fetches data from the API and sets the base code hierarchies list.
   */
  const fetchData = async () => {
    const getBaseCodeHierarchyRepsonse = await api.get<
      ApiResponse<BaseCodeHierarchy[]>
    >("/Picklist/basecode-hierarchies");
    setBaseCodeHierarchiesList(getBaseCodeHierarchyRepsonse?.data || []);
  };

  /**
   * A function that opens the edit click with the provided grid parameters.
   *
   * @param {any} gridParams - the parameters for the grid
   * @return {void}
   */
  const showEditClickOpen = (gridParams: any) => {
    setShowAddUpdateModal(true);
    formik.setValues({ ...gridParams.row });
  };

  /**
   * A function that opens the delete modal and sets form values.
   *
   * @param {any} gridParams - the parameters for the grid
   * @return {void}
   */
  const showDeleteModalOpen = (gridParams: any) => {
    setDeleteModalOpen(true);
    formik.setValues({ ...gridParams.row });
  };

  /**
   * Handles closing the modal and resetting form state.
   */
  const handleCloseModal = () => {
    setShowAddUpdateModal(false);
    setDeleteModalOpen(false);
    formik.resetForm();
  };

  /**
   * Update the isActive status of a BaseCodeHierarchy row.
   *
   * @param {BaseCodeHierarchy} row - the row to update
   * @param {boolean} isActive - the new isActive status
   */
  const updateBaseCodeActive = async (
    row: BaseCodeHierarchy,
    isActive: boolean
  ) => {
    row.isActive = isActive;
    try {
      api
        .put<ApiResponse<number>>("/Picklist/basecode-hierarchy", row)
        .then(async (response: any) => {
          if (response.isSuccess) {
            setUpdateRows(response);
            toast.success(response.message);
          }
        })
        .catch((error: any) => {
          console.log("Exception from basecode hierarchy", error);
        });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  /**
   * A function that handles the deletion of a resource via API call.
   *
   * @return {void}
   */
  const deleteSubmit = () => {
    try {
      api
        .delete<ApiResponse<SessionDetails>>(
          `/Picklist/basecode-hierarchy/${formik.values.id}`
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
        .required("Rank is Required")
        .min(1, "Rank must be greater than 0")
        .test(
          "check-rank-duplicate",
          "Rank already exists",
          function async(value) {
            return new Promise((resolve) => {
              const isRankDuplicate = baseCodeHierarchiesList.some(
                (item) => item.rank === value && item.id !== formik.values.id
              );
              isRankDuplicate ? resolve(false) : resolve(true);
            });
          }
        ),
      attachType: Yup.string()
        .required("Attach Type is Required")
        .min(1, "Attach Type must be at least 1 characters")
        .max(40, "Attach Type must be at most 40 characters")
        .test(
          "check-attach-type-duplicate",
          "Attach type already exists",
          function async(value) {
            return new Promise((resolve) => {
              const isAttachDuplicate = baseCodeHierarchiesList.some(
                (item) =>
                  item.attachType.trim().toLowerCase() ===
                    value.trim().toLowerCase() && item.id !== formik.values.id
              );
              isAttachDuplicate ? resolve(false) : resolve(true);
            });
          }
        ),
    }),
    /**
     * A description of the entire function.
     *
     * @param {type} values - description of parameter
     * @return {type} description of return value
     */
    onSubmit: async (values) => {
      try {
        if (values.id > 0) {
          api
            .put<ApiResponse<number>>("/Picklist/basecode-hierarchy", {
              id: values.id,
              rank: values.rank,
              attachType: values.attachType,
              isActive: JSON.parse(`${values.isActive}`),
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
              console.log("Exception from basecode hierarchy", error);
            });
        } else {
          api
            .post<ApiResponse<number>>("/Picklist/basecode-hierarchy", {
              rank: values.rank,
              attachType: values.attachType,
              isActive: JSON.parse(`${values.isActive}`),
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
              console.log("Exception from basecode hierarchy", error);
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
          Add Attach Type
        </Button>
        <BaseCodeModal
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
        data={baseCodeHierarchiesList}
        column={BaseCodeHierarchyGridCollumns}
        sortByField="id"
        sortByOrder="desc"
      />
    </>
  );
}
