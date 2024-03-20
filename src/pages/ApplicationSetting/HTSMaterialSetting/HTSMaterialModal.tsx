import { 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField
} from "@mui/material"
import { HTSMaterialModalProps } from "../../../utils/interfaceModel";

const HTSMaterialModal = (props: HTSMaterialModalProps) => {
    const {isOpen, onClose, formik} = props
    
    return(
        <Dialog open = {isOpen} fullWidth>
            <DialogActions>
                <Button onClick = {onClose}>x</Button>
            </DialogActions>
            <form onSubmit = {formik.handleSubmit}>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin = "dense"
                        id = "description"
                        name = "description"
                        label = {
                            formik.errors.description ? 
                            formik.errors.description : "Enter HTS Material"
                        }
                        type = "text"
                        fullWidth
                        value = {formik.values.description}
                        onChange = {formik.handleChange}
                        error = {formik.touched.description && Boolean(formik.errors.description)}
                        onBlur = {formik.handleBlur}
                    />
                    <h4>Set Active</h4>
                    <RadioGroup
                        row
                        name = "isActive"
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        value = {formik.values.isActive}
                        onChange = {(event) => {
                            formik.handleChange(event);
                        }}
                    >
                        <FormControlLabel value = {true} control = {<Radio/>} label = "Active"/>
                        <FormControlLabel value = {false} control = {<Radio/>} label = "Inactive"/>
                    </RadioGroup>
                    <DialogActions>
                        <Button
                            variant = "contained"
                            type = "submit"
                        >
                            {formik.values.id > 0 ? "Update HTS Material" : "Add HTS Material"}
                        </Button>
                    </DialogActions>
                </DialogContent>
            </form>
        </Dialog>
    )
};

export default HTSMaterialModal;