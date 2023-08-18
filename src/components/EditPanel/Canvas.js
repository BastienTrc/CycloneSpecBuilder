import React, { useEffect } from "react";
import './Canvas.css';
import { initCanvas } from "../../utils/canvas/canvasInit";
import FormDialog from './FormDialog'
import ContextMenu from "../../utils/canvas/ContextMenu";


function Canvas({ setShowResult, setReloadInfos, setSelectedData}){

  // Used to show the dialog
  const [open, setOpen] = React.useState(false);
  // Used as an intermediary between form and canvas to edit nodes and edges
  const [content, setContent] = React.useState("")

  const [menuPos, setMenuPos] = React.useState({x:"0px",y:"0px"});
  const [menuVisible, setMenuVisible] = React.useState(false);


  useEffect( () => {
    initCanvas(setOpen, setContent, setShowResult, setMenuPos, setMenuVisible, setReloadInfos, setSelectedData);
  },[]);
  
  return (
    <>
    <div id={"canvasContainer"} className='canvasContainer flexC bordered'/>
    <ContextMenu pos={menuPos} visible={menuVisible} setVisible={setMenuVisible}/>
    <FormDialog open={open} setOpen={setOpen} content={content}/>
    </>
    )
  }
  
  export default Canvas