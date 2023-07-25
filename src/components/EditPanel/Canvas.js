import React, { useEffect } from "react";
import './Canvas.css';
import { initCanvas } from "../../utils/canvas/canvasInit";
import FormDialog from './FormDialog'


function Canvas({panel, setShowResult}){

  // Used to show the dialog
  const [open, setOpen] = React.useState(false);
  // Used as an intermediary between form and canvas to edit nodes and edges
  const [content, setContent] = React.useState("")


  useEffect( () => {
    initCanvas(setOpen, setContent, setShowResult);
  },[]);
  
  return (
    <>
    <div id={"canvasContainer"} className='canvasContainer flexC bordered'/>
    <FormDialog open={open} setOpen={setOpen} content={content}/>
    </>
    )
  }
  
  export default Canvas