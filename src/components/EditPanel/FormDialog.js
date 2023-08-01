import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { getNetwork, setNodeContent, setIsDialogOpen} from '../../utils/canvas/canvasInit';

// This code is in part made of the MUI Material example
export default function FormDialog({open, setOpen, content}) {

   // Add listener to cancel addNode action
   document.addEventListener('keydown', (event => {
    if (open && !event.shiftKey && event.key === "Enter"){
        doEdit();
    }
}))

const [isFormValid, setIsFormValid] = React.useState(false);

// Close the dialog
  function handleClose(){
    setOpen(false);
    setIsDialogOpen(false)
    // Also need to set local 'open' for key shortcut
    open = false
  };

  // Close the dialog and edit the node if form isn't empty
  function doEdit(){
    // @ts-ignore Maybe doesn't know value property because from an API?
    let formValue = document.getElementById("formDialogName")?.value;
    if (formValue === undefined || formValue === ""){
      setOpen(false);
      setIsDialogOpen(false)
       // Also need to set local 'open' for key shortcut
       open = false;
      return;
    }
    setNodeContent(formValue);
    let network = getNetwork();
    console.log(network.getSelectedNodes())
    if (network.getSelectedNodes().length === 1){
      network.editNode();
    } else {
      network.editEdgeMode();
      network.disableEditMode();
    }
    
    setOpen(false);
    setIsDialogOpen(false)
     // Also need to set local 'open' for key shortcut
     open = false;
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit node/edge</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name (node) or a condition (edge).
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="formDialogName"
            label={content}
            type="text"
            defaultValue={content}
            fullWidth
            variant="standard"
            multiline={true}
            error={isFormValid}
            onChange={(event) => setIsFormValid(event.target.value.includes(" "))}
            helperText="Node/State label can't contain whitespace"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={doEdit}>Edit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

