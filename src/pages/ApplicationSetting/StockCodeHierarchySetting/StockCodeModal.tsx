import { Button, Dialog, DialogActions, DialogContent, FormControlLabel, Grid, Radio, RadioGroup, TextField } from "@mui/material";
import { StockCodeModalProps } from "../../../utils/interfaceModel";

const StockCodeModal = (props: StockCodeModalProps) => {
    
    const {isOpen, onClose, formik} = props;

    return(
        <>
            <Dialog open = {isOpen} onClose = {onClose} fullWidth>
                <DialogActions>
                    <Button onClick = {onClose}>x</Button>
                </DialogActions>
                <form onSubmit = {formik.handleSubmit}>
                <DialogContent>
                    <Grid container spacing = {2}>
                        <Grid item xs = {4}>
                            <TextField
                                autoFocus
                                margin = "dense"
                                id = "rank"
                                name = "rank"
                                label = {
                                    formik.errors.rank
                                    ? formik.errors.rank: 
                                    "Enter Rank"
                                }
                                type = "number"
                                error = {formik.touched.rank && Boolean(formik.errors.rank)}
                                onBlur={formik.handleBlur}
                                value = {formik.values.rank}
                                onChange = {formik.handleChange}
                            />
                        </Grid>
                        <Grid item xs = {8}>
                            <TextField
                                margin = "dense"
                                id = "attachType"
                                name = "attachType"
                                label = {
                                    formik.errors.attachType
                                    ? formik.errors.attachType:
                                    "Enter Attach Type"
                                }
                                type = "text"
                                error = {formik.touched.attachType && Boolean(formik.errors.attachType)}
                                onBlur={formik.handleBlur}
                                fullWidth
                                value = {formik.values.attachType}
                                onChange = {formik.handleChange}
                            />
                        </Grid>
                    </Grid>
                    <h4>Set Active</h4>
                    <RadioGroup
                        row
                        name = "isActive"
                        aria-labelledby = "demo-row-radio-buttons-group-label"
                        value = {formik.values.isActive}
                        onChange={(event) => {
                            formik.handleChange(event);
                        }}
                    >
                        <FormControlLabel value = {true} control = {<Radio/>} label = 'Active'/>
                        <FormControlLabel value = {false} control = {<Radio/>} label = 'Inactive'/>
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button 
                        variant = "contained"
                        type = "submit"
                    >
                        {formik.values.id > 0? "Update Attach Type": "Add Attach Type"}
                    </Button>
                </DialogActions>
                </form>
            </Dialog>
        </>
    )
};

export default StockCodeModal;