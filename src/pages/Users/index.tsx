import { GridColDef } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import api from "../../services/ApiService";
import { ApiResponse } from "../../models/ApiResponse";
import { User, UserRole } from "../../models/User";
import { Chip, Stack, Button, Switch } from "@mui/material";
import { GridRowParams, GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import UserModal from "./UserModal";
import { toast } from "react-toastify";
import UserListing from "./UserListing";
import Loader from "../../components/Loader";
import { useFormik } from "formik";
import * as Yup from "yup";

const UserList = () => {
  const [isLoading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userEditOpen, setUserEditOpen] = useState(false);
  const [userListData, setUserListData] = useState([] as any);
  const [userEditId, setUserEditId] = useState(null);
  const [updateRowsData, setUpdatedRowsData] = useState<boolean>(false);
  const [newRoleStatus, setNewRoleStatus] = useState(true);

  const usersGridschema: GridColDef[] = [
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "name",
      headerName: "Name",
      width: 150,
    },
    {
      field: "email",
      headerName: "Email",
      type: "string",
      width: 300,
    },
    {
      field: "roles",
      headerName: "Role",
      type: "string",
      width: 450,
      renderCell: (params: any) => {
        if (!params.value) {
          return params.value;
        } else {
          const rolesHTML = params?.row?.roles?.map((item: any, index) => {
            return <Chip label={item.name} />;
          });
          return (
            <Stack
              direction="row"
              style={{ width: "100%", whiteSpace: "pre-wrap" }}
              spacing={1}
            >
              {rolesHTML}
            </Stack>
          );
        }
      },
    },
    {
      field: "isActive",
      headerName: "Status",
      renderCell: (params: any) => (
        <>
          <Switch
            checked={params.value}
            onChange={(e) => {
              params.api.setEditCellValue(
                { id: params.id, field: params.field },
                e.target.checked
              );
              updateUsersStatus(params.row);
            }}
            color="primary"
            inputProps={{ "aria-label": "controlled" }}
          />
        </>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      type: "actions",
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          onClick={() => handleEditUser(params.id)}
          label="Edit"
        />,
      ],
    },
  ];
  useEffect(() => {
    getUserList();
  }, [updateRowsData]);

  const updateUsersStatus = (user: User) => {
    const data = {
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: !user.isActive,
    };
    try {
      api
        .put<ApiResponse<User>>("/User", data)
        .then((response: ApiResponse<User>) => {
          if (response.isSuccess) {
            setUpdatedRowsData(!updateRowsData);
            toast.success(response.message);
          } else {
            throw new Error(response.message);
          }
        })
        .catch((error) => {
          console.log("Exception from User", error);
        });
    } catch (err: any) {
      toast.error(err.message);
    }
  };
  const getUserList = async () => {
    try {
      api
        .get<ApiResponse<User>>(`/UserRole`)
        .then((response: ApiResponse<User>) => {
          if (response.isSuccess) {
            setLoading(false);
            setUserListData(response.data);
          } else {
            throw new Error(response.message);
          }
        })
        .catch((error) => {
          console.log("Exception from UserRole", error);
        });
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const openAddModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUserEditOpen(false);
    formik.resetForm();
  };

  const handleRadioChange = () => {
    setNewRoleStatus(!newRoleStatus);
  };

  const handleEditUser = (editId: any) => {
    setUserEditId(editId);
    api
      .get<ApiResponse<User>>(`/UserRole/${editId}`)
      .then((response: ApiResponse<User>) => {
        if (response.isSuccess) {
          setIsModalOpen(true);

          const roleIds: string[] = response?.data?.roles?.map((role) =>
            role.id.toString()
          );

          formik.setValues({
            name: response.data.name,
            email: response.data.email,
            roles: roleIds,
            newRoleStatus: response.data.isActive,
          });
          setUserEditOpen(true);
        } else {
          throw new Error(response.message);
        }
      })
      .catch((error) => {
        console.log("Exception from fetching userData for edit", error);
      });
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      roles: [] as string[],
      newRoleStatus: true,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      name: Yup.string()
        .required("Name is required")
        .min(1, "Name must be at least 1 characters")
        .max(40, "Name must be at most 40 characters"),
      newRoleStatus: Yup.string().required("Select the status"),
    }),
    onSubmit: (formData) => {
      const performUserApiCall = async (
        url: string,
        data: any,
        successMessage: string,
        isPost: boolean
      ) => {
        try {
          const response = await api[isPost ? "post" : "put"]<
            ApiResponse<User>
          >(url, data);

          if (response.isSuccess) {
            const userRoleData = {
              userId: isPost ? response.data : userEditId,
              roles: isPost ? formData?.roles : formData?.roles,
            };

            await api.post<ApiResponse<UserRole>>("/UserRole", userRoleData);

            toast.success(successMessage);
            setIsModalOpen(false);
            setUpdatedRowsData(!updateRowsData);
          } else {
            throw new Error(response.message);
          }
        } catch (error: any) {
          console.log("Exception from login", error);
        }
      };

      if (userEditOpen) {
        const userUpdatedData = {
          id: userEditId,
          name: formData?.name,
          email: formData?.email,
          isActive: formData?.newRoleStatus,
        };

        formData.roles.length
          ? performUserApiCall(
              "/User",
              userUpdatedData,
              "User updated successfully",
              false
            )
          : toast.error("Role needs to be selected! ");
      } else {
        const userData = {
          name: formData?.name,
          email: formData?.email,
          isActive: formData?.newRoleStatus,
        };

        formData.roles.length
          ? performUserApiCall(
              "/User",
              userData,
              "User added successfully",
              true
            )
          : toast.error("Role needs to be selected! ");
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
            <Button onClick={openAddModal} variant="contained">
              Add User
            </Button>
            <UserModal
              closeModal={closeModal}
              isModalOpen={isModalOpen}
              userEditOpen={userEditOpen}
              handleRadioChange={handleRadioChange}
              formik={formik}
            />
          </div>
          <UserListing
            userListData={userListData}
            usersGridschema={usersGridschema}
          />
        </>
      )}
    </>
  );
};
export default UserList;
