import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  FormControlLabel,
  Checkbox,
  FormGroup,
  RadioGroup,
  Radio,
} from "@mui/material";
import { useState, useEffect } from "react";
import api from "../../services/ApiService";
import { ApiResponse } from "../../models/ApiResponse";
import { toast } from "react-toastify";
import { User } from "../../models/User";

const UserModal = ({
  closeModal,
  isModalOpen,
  userEditOpen,
  handleRadioChange,
  formik,
}) => {
  const [userRoleOptions, setUserRoleOptions] = useState<User[]>([]);
  const getRoleList = () => {
    try {
      api
        .get<ApiResponse<User[]>>(`/Role/list`)
        .then((response: ApiResponse<User[]>) => {
          if (response.isSuccess) {
            setUserRoleOptions(response.data);
          } else {
            throw new Error(response.message);
          }
        })
        .catch((error) => {
          console.log("Exception from Role List", error);
        });
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getRoleList();
  }, []);

  const rolesCheckboxRender = () => {
    return userRoleOptions.map((value, index) => (
      <div key={index}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formik.values.roles.includes(String(value.id))}
              onChange={() => {
                const roles = formik.values.roles;
                const roleId = String(value.id);

                if (roles.includes(roleId)) {
                  // If role is already selected, remove it
                  const updatedRoles = roles.filter((role) => role !== roleId);
                  formik.setFieldValue("roles", updatedRoles);
                } else {
                  // If role is not selected, add it
                  formik.setFieldValue("roles", [...roles, roleId]);
                }
              }}
              name={`roles.${value.id}`}
            />
          }
          label={value.name}
        />
      </div>
    ));
  };

  return (
    <>
      <Dialog open={isModalOpen} onClose={closeModal} fullWidth>
        <DialogActions>
          <Button onClick={closeModal}>x</Button>
        </DialogActions>
        <form onSubmit={formik.handleSubmit}>
          {" "}
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={formik.errors.name ? formik.errors.name : "Enter Name"}
              type="text"
              fullWidth
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
            />
            <TextField
              margin="dense"
              id="email"
              label={formik.errors.email ? formik.errors.email : "Enter Email"}
              type="text"
              fullWidth
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              error={formik.touched.email && Boolean(formik.errors.email)}
            />

            <h4>Set Roles</h4>
            <FormGroup>
              <div
                style={{
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                {" "}
                {rolesCheckboxRender()}
              </div>
            </FormGroup>
            <h4>Set Status</h4>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="newRoleStatus"
              value={formik.values.newRoleStatus}
              onChange={(event) => {
                formik.handleChange(event);
                handleRadioChange(event);
              }}
            >
              <FormControlLabel
                value={true}
                control={<Radio />}
                label="Active"
              />
              <FormControlLabel
                value={false}
                control={<Radio />}
                label="Inactive"
              />
            </RadioGroup>
            <DialogActions>
              <Button variant="contained" type="submit">
                {userEditOpen ? "Update User" : "Add User"}
              </Button>
            </DialogActions>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
};

export default UserModal;
