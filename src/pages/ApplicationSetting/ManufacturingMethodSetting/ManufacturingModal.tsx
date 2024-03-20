import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";

import { ManufacturingModalProps } from "../../../utils/interfaceModel";

const ManufacturingModal = (props: ManufacturingModalProps) => {
  const { isOpen, onClose, formik } = props;

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} fullWidth>
        <DialogActions>
          <Button onClick={onClose}>x</Button>
        </DialogActions>
        <form onSubmit={formik.handleSubmit}>
          {" "}
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="method"
              name="method"
              label={
                formik.errors.method == "Method already exists"
                  ? formik.errors.method
                  : "Enter Manufacturing Method"
              }
              type="text"
              fullWidth
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.method}
              error={formik.touched.method && Boolean(formik.errors.method)}
            />
            <h4>Set Active</h4>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="isActive"
              value={formik.values.isActive}
              onChange={(event) => {
                formik.handleChange(event);
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
                {formik?.values.id > 0
                  ? "Update Manufacturing Method"
                  : "Add Manufacturing Method"}
              </Button>
            </DialogActions>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
};

export default ManufacturingModal;
