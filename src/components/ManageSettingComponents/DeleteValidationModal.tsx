import { Button, Dialog, DialogActions, DialogContent, Typography } from "@mui/material";

const DeleteValidationModal = ({
    addModalOpen,
    handleCloseModal,
    deleteSubmit
}) => {
    return (
    <>
        <Dialog open={addModalOpen} onClose={handleCloseModal} >
            <DialogActions>
              <Button onClick={handleCloseModal}>x</Button>
            </DialogActions>
            <DialogContent>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Delete Confirm
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Are you sure you want to delete this item?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={deleteSubmit}>Yes</Button>
                <Button onClick={handleCloseModal}>Cancel</Button>
            </DialogActions>
        </Dialog>
    
    </>);
        
};
export default DeleteValidationModal;