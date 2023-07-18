import React, { useEffect } from "react";
import './EditPanel.css';
import { initCanvas } from "../../utils/canvasInit";
import FormDialog from './FormDialog'


function SpecCanvas({panel}){

  // Used to show the dialog
  const [open, setOpen] = React.useState(false);
  // Used as an intermediary between form and canvas to editNode
  const [content, setContent] = React.useState("")


  useEffect( () => {
    initCanvas(setOpen, setContent);
  },[]);
  
  return (
    <>
    <div id={"canvasContainer"} className='canvasContainer'/>
    <FormDialog open={open} setOpen={setOpen} content={content}/>
    </>
    )
  }
  
  
  export default SpecCanvas