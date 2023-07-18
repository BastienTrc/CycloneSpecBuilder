import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { getNetwork, setNodeContent } from '../../utils/canvasInit';


export default function FormDialog({open, setOpen, content}) {

   // Add listener to cancel addNode action
   document.addEventListener('keydown', (event => {
    if (open && !event.shiftKey && event.key === "Enter"){
        editNode();
    }
}))

// Close the dialog
  function handleClose(){
    setOpen(false);
    // Also need to set local 'open' for key shortcut
    open = false
  };

  // Close the dialog and edit the node if form isn't empty
  function editNode(){
    setOpen(false);
    // Also need to set local 'open' for key shortcut
    open = false;
    // @ts-ignore Maybe doesn't know value property because from an API?
    let formValue = document.getElementById("formDialogName")?.value;
    if (formValue === ""){
      return;
    }
    setNodeContent(formValue);
    getNetwork().editNode()
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit node</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for the node.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="formDialogName"
            label={content}
            type="text"
            fullWidth
            variant="standard"
            multiline={true}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={editNode}>Edit node</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

