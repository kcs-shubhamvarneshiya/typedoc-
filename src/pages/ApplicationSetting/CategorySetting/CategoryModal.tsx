import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    Grid,
  } from "@mui/material";

  import {CategoryModalProps} from "../../../utils/interfaceModel"

//   interface CategoryModalProps{
//     isOpen: boolean;
//     onClose: VoidFunction;
//     formik: any;
//   }

  const CategoryModal = (props:CategoryModalProps)=>{
    const {isOpen, onClose, formik} = props

    return(
        <>
            <Dialog open={isOpen} onClose={onClose} fullWidth>
                <DialogActions>
                    <Button onClick = {onClose}>x</Button>
                </DialogActions>
                <form onSubmit = {formik.handleSubmit}>
                <DialogContent>
                    <Grid container spacing = {2}>
                        <Grid item xs = {8}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="description"
                                name = "description"
                                label = {
                                    formik.errors.description ?
                                    formik.errors.description : "Enter Category Name"
                                }
                                type = "text"
                                fullWidth
                                value = {formik.values.description}
                                onChange = {formik.handleChange}
                                error = {formik.touched.description && Boolean(formik.errors.description)}
                                onBlur={formik.handleBlur}
                            />
                        </Grid>
                        <Grid item xs = {4}>
                            <TextField
                                margin="dense"
                                id="sort"
                                name = "sort"
                                label = {
                                    formik.errors.sort ?
                                    formik.errors.sort : "Enter Sort"
                                }
                                type = "text"
                                fullWidth
                                value = {formik.values.sort}
                                onChange = {formik.handleChange}
                                error = {formik.touched.sort && Boolean(formik.errors.sort)}
                                onBlur={formik.handleBlur}
                            />
                        </Grid>
                    </Grid>
                    <h4>Set Active</h4>
                    <RadioGroup
                        row  
                        name = "isActive"
                        value = {formik.values.isActive}
                        onChange = {(event) => formik.handleChange(event)}
                    >
                        <FormControlLabel value ={true} control={<Radio/>} label = "Active"/>
                        <FormControlLabel value ={false} control={<Radio/>} label = "Inactive"/>
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        type = "submit"
                    >
                        {formik.values.id > 0 ? "Update Category": "Add Category"}
                    </Button>
                </DialogActions>
                </form>
            </Dialog>
        </>
    )
  };

export default CategoryModal;