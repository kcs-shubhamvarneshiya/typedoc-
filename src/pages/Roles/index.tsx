import React, { useState, useEffect } from "react";
import { Button, Stack, Switch, Chip } from "@mui/material";
import { GridRowParams, GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import api from "../../services/ApiService";
import { ApiResponse } from "../../models/ApiResponse";
import { Role } from "../../models/Role";
import RoleListing from "./RoleListing";
import RoleModal from "./RoleModal";
import { SessionDetails } from "../../models/SessionDetails";
import Loader from "../../components/Loader";
import { useFormik } from "formik";
import * as Yup from "yup";

const RoleList = () => {
  const [isLoading, setLoading] = useState(true);
  const [userListData, setUserListData] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editRoleId, setEditRoleId] = useState(null);
  const [newRoleStatus, setNewRoleStatus] = useState(true);
  const [roleEditEnable, setRoleEditEnable] = useState(false);
  const [updateRows, setUpdatedRows] = useState([]);

  const rolesGridSchema = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "name",
      headerName: "Name",
      width: 150,
    },
    {
      field: "permissions",
      headerName: "Permissions",
      type: "Array",
      width: 500,
      renderCell: (params: any) => {
        if (!params.value) {
          return params.value;
        } else {
          return params?.row?.permissions.map((item: any) => {
            return (
              <Stack direction="row" key={item.id} spacing={1}>
                <Chip label={item.name} />
              </Stack>
            );
          });
        }
      },
    },
    {
      field: "isActive",
      headerName: "Status",
      width: 130,
      renderCell: (params: any) => (
        <>
          <Switch
            checked={params.value}
            onChange={(e) => {
              params.api.setEditCellValue(
                { id: params.id, field: params.field },
                e.target.checked
              );
              updateRoleStatus(params.row);
            }}
            color="primary"
            inputProps={{ "aria-label": "controlled" }}
          />
        </>
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Action",
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          onClick={() => handleEditClickOpen(params.id)}
          label="Edit"
        />,
      ],
    },
  ];

  useEffect(() => {
    getRolesList();
  }, [updateRows]);

  const handleEditClickOpen = (editId: any) => {
    setEditRoleId(editId);
    api
      .get<ApiResponse<Role>>(`/RolePermission/${editId}`)
      .then((response) => {
        if (response.isSuccess) {
          const editRolePermissions = response?.data?.permissions.map((item) =>
            item.id.toString()
          );

          formik.setValues({
            name: response.data.name,
            permissions: editRolePermissions,
            newPermissionStatus: response.data.isActive,
          });
          setAddModalOpen(true);
          setRoleEditEnable(true);
        } else {
          throw new Error(response.message);
        }
      })
      .catch((error) => {
        console.log("Exception from RolePermission", error);
      });
  };

  const getRolesList = async () => {
    try {
      api
        .get<ApiResponse<Role>>(`/RolePermission/list`)
        .then((response: any) => {
          if (response.isSuccess) {
            setLoading(false);
            setUserListData(response.data);
          } else {
            throw new Error(response.message);
          }
        })
        .catch((error) => {
          console.log("Exception from RolePermission", error);
        });
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleOpenModal = () => {
    setAddModalOpen(true);
  };

  const handleClose = () => {
    setAddModalOpen(false);
    setRoleEditEnable(false);
    setEditRoleId(null);
    formik.resetForm();
  };

  const updateRoleStatus = ({ id, isActive, name, updatedBy, updatedDate }) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
    const data = {
      id,
      name,
      isActive: !isActive,
      updatedBy: 1,
      updatedDate: formattedDate,
    };
    try {
      api
        .put<ApiResponse<SessionDetails>>("/Role", data)
        .then((response: any) => {
          if (response.isSuccess) {
            setUpdatedRows(response);
            toast.success(response.message);
          } else {
            throw new Error(response.message);
          }
        })
        .catch((error) => {
          console.log("Exception from Role", error);
        });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleRadioChange = () => {
    setNewRoleStatus(!newRoleStatus);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      permissions: [] as string[],
      newPermissionStatus: true,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Role is required")
        .min(1, "Role must be at least 1 characters")
        .max(40, "Role must be at most 40 characters"),
      newPermissionStatus: Yup.string().required("Select the status"),
    }),
    onSubmit: async (formData) => {
      if (roleEditEnable) {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString();
        const updatedRoleData = {
          id: editRoleId,
          name: formData.name,
          isActive: formData.newPermissionStatus,
          updatedBy: 1,
          updatedDate: formattedDate,
        };

        if (formData.permissions.length) {
          try {
            const response = await api.put<ApiResponse<SessionDetails>>(
              "/Role",
              updatedRoleData
            );

            if (response.isSuccess) {
              const permissionData = {
                roleId: editRoleId,
                permissions: formData.permissions,
              };

              const permissionResponse = await api.post<ApiResponse<Role>>(
                "/RolePermission",
                permissionData
              );

              if (permissionResponse.isSuccess) {
                setAddModalOpen(false);
                setRoleEditEnable(false);
                setEditRoleId(null);
                formik.resetForm();
                setUpdatedRows(response.name);
                toast.success(response.message);
              } else {
                throw new Error(permissionResponse.message);
              }
            } else {
              throw new Error(response.message);
            }
          } catch (error: any) {
            console.log("Exception from roles ", error);
          }
        } else {
          toast.error("Permission needs to be selected!");
        }
      } else {
        const newRoleData = {
          name: formData.name,
          isActive: formData.newPermissionStatus,
        };

        if (formData.permissions.length) {
          try {
            const response = await api.post<ApiResponse<Role>>(
              "/Role",
              newRoleData
            );

            if (response.isSuccess) {
              toast.success(response.message);

              const newUserRoleData = {
                roleId: response.data,
                permissions: formData.permissions,
              };

              const permissionResponse = await api.post<ApiResponse<Role>>(
                "/RolePermission",
                newUserRoleData
              );

              if (permissionResponse.isSuccess) {
                setUpdatedRows([]);
                setAddModalOpen(false);
                formik.resetForm();
              } else {
                throw new Error(permissionResponse.message);
              }
            } else {
              throw new Error(response.message);
            }
          } catch (error: any) {
            console.log("Exception from roles ", error);
          }
        } else {
          toast.error("Permission needs to be selected!");
        }
      }
    },
  });

  return (
    <>
      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <>
          <div>
            <Button variant="contained" onClick={handleOpenModal}>
              Add Role
            </Button>
            <RoleModal
              addModalOpen={addModalOpen}
              handleClose={handleClose}
              handleRadioChange={handleRadioChange}
              roleEditEnable={roleEditEnable}
              formik={formik}
            />
          </div>
          <RoleListing
            userListData={userListData}
            rolesGridSchema={rolesGridSchema}
          />
        </>
      )}
    </>
  );
};

export default RoleList;
