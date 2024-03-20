import { 
    Button,
    Dialog, 
    DialogActions, 
    DialogContent, 
    FormControlLabel, 
    Radio, 
    RadioGroup, 
    TextField,
 } from "@mui/material";
 import { SecondaryMaterialModalProps } from "../../../utils/interfaceModel";

const SecondaryMaterialModal = (props: SecondaryMaterialModalProps) => {
    const {isOpen, onClose, formik} = props

    return(
        <>
            <Dialog open = {isOpen} onClose = {onClose} fullWidth>
                <DialogActions>
                    <Button onClick = {onClose}>x</Button>
                </DialogActions>
                <form onSubmit = {formik.handleSubmit}>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin = "dense"
                            id = "name"
                            name = "name"
                            label = {
                                formik.errors.name? 
                                formik.errors.name : "Enter Secondary Material"
                            }
                            type = "text"
                            fullWidth
                            value = {formik.values.name}
                            onChange = {formik.handleChange}
                            error = {formik.touched.name && Boolean(formik.errors.name)}
                            onBlur = {formik.handleBlur}
                        />
                        <h4>Set Active</h4>
                        <RadioGroup
                            row
                            name = "isActive"
                            value = {formik.values.isActive}
                            onChange = {
                                (event) => formik.handleChange(event)
                            }
                        >
                            <FormControlLabel value = {true} control = {<Radio/>} label = "Active"/>
                            <FormControlLabel value = {false} control = {<Radio/>} label = "Inactive"/>
                        </RadioGroup>
                        <DialogActions>
                            <Button variant = "contained"
                                type = "submit"
                            >
                            {
                                formik.values.id > 0 ?
                                "Update Secondary Material" : "Add Secondary Material"
                            }
                            </Button>
                        </DialogActions>
                    </DialogContent>
                </form>

            </Dialog>
        </>
    );
}

export default SecondaryMaterialModal;