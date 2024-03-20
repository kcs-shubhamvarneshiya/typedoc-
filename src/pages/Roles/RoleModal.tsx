import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from "@mui/material";
import { Permissions } from "../../models/Enum";
const RoleModal = ({
  addModalOpen,
  handleClose,
  handleRadioChange,
  roleEditEnable,
  formik,
}) => {
  const permissionsCheckboxRender = () => {
    const permissionArray = Object.entries(Permissions)
      .map(([key, value]) => ({
        id: parseInt(key),
        name: typeof value === "string" ? value : "",
      }))
      .filter((item) => item.id !== null && item.name !== "");

    return permissionArray.map((value, index) => (
      <div key={index}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formik.values.permissions.includes(String(value.id))}
              onChange={() => {
                const permissions = formik.values.permissions;
                const permissionsId = String(value.id);

                if (permissions.includes(permissionsId)) {
                  // If permission is already selected, remove it
                  const updatedPermissions = permissions.filter(
                    (permission) => permission !== permissionsId
                  );
                  formik.setFieldValue("permissions", updatedPermissions);
                } else {
                  // If permission is not selected, add it
                  formik.setFieldValue("permissions", [
                    ...permissions,
                    permissionsId,
                  ]);
                }
              }}
              name={`permissions.${value.id}`}
            />
          }
          label={value.name}
        />
      </div>
    ));
  };

  return (
    <>
      <Dialog open={addModalOpen} onClose={handleClose} fullWidth>
        <DialogActions>
          <Button onClick={handleClose}>x</Button>
        </DialogActions>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={formik.errors.name ? formik.errors.name : "Enter Role"}
              type="text"
              fullWidth
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
            />
            <h4>Set Permissions</h4>
            <FormGroup>
              <div
                style={{
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                {" "}
                {permissionsCheckboxRender()}
              </div>
            </FormGroup>
            <h4>Set Status</h4>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="newPermissionStatus"
              value={formik.values.newPermissionStatus}
              onChange={(event) => {
                formik.handleChange(event);
                handleRadioChange(event);
              }}
            >
              <FormControlLabel
                value="true"
                control={<Radio />}
                label="Active"
              />
              <FormControlLabel
                value="false"
                control={<Radio />}
                label="Inactive"
              />
            </RadioGroup>
            <DialogActions>
              <Button variant="contained" type="submit">
                {roleEditEnable ? "Update Role" : "Add Role"}
              </Button>
            </DialogActions>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
};
export default RoleModal;
