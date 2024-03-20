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

const ProjectStageModal = ({
    addModalOpen,
    handleCloseModal,
    editEnable,
    editSubmit,
    addNewSubmit,
    name, setName,
    family, setFamily,
    item, setItem,
    activity, setActivity,
    isActiveChecked,
    handleRadioChange
  }) => {
    return (
        <>
          <Dialog open={addModalOpen} onClose={handleCloseModal} fullWidth>
            <DialogActions>
              <Button onClick={handleCloseModal}>x</Button>
            </DialogActions>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="description"
                    label="Enter Stage"
                    type="text"
                    fullWidth
                    variant="standard"
                    value = {name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    margin="dense"
                    id="family"
                    label="Enter Family"
                    type="text"
                    variant="standard"
                    value = {family}
                    onChange={(e) => setFamily(e.target.value)}
                />
                <TextField
                    margin="dense"
                    id="item"
                    label="Enter Item"
                    type="text"
                    variant="standard"
                    value = {item}
                    onChange={(e) => setItem(e.target.value)}
                />
                <TextField
                    margin="dense"
                    id="activity"
                    label="Enter Activity"
                    type="number"
                    variant="standard"
                    value = {activity}
                    onChange={(e) => setActivity(e.target.value)}
                />
                <h4>Set Active</h4>
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={isActiveChecked}
                    onChange={handleRadioChange}
                >
                <FormControlLabel value="true" control={<Radio />} label="Active" />
                <FormControlLabel value="false" control={<Radio />} label="Inactive"/>
                </RadioGroup>
            <DialogActions>
            <Button
              variant="contained"
              onClick={editEnable ? editSubmit : addNewSubmit}
            >
              {editEnable ? "Update Stage" : "Add Stage"}
            </Button>
            </DialogActions>
            </DialogContent>
          </Dialog>
        </>
      );
    };
export default ProjectStageModal;
    