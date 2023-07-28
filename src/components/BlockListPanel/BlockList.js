import './BlockList.css'
import React from 'react';
import { useState, useEffect } from 'react';
import { cancelAction, getNetwork, setAddNodeMode, setCanvasInfo, setNodeContent, switchEdgeMode} from '../../utils/canvas/canvasInit';
import Nodes from './Blocks/Nodes';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';


/**
 * Set the content (label in vis-js) of the node that will be added
 * @param {String} id The id of the node to add
 */
function addNode(id){
  let network = getNetwork()
  if (!network){
    alert("Can't find network");
    return;
  }
  let selectedNode = document.getElementById(id);

  // If user clicked on the node that was already activated, disable it. 
  // /!\ Has to be check before 'cancelAction()'
  if (selectedNode?.classList.contains("selected")){
    cancelAction();
    return;
  }
  // Only one mode can be activated at a time.
  cancelAction();
  setNodeContent(id);
  selectedNode?.classList.add("selected")
  setCanvasInfo("Click on the canvas to place the node.");
  setAddNodeMode(true);
  network.addNodeMode()
}

const BlockList = () => {
  // TODO Generate dynamically after
  const [blocks,setBlocks] = useState([
    {  id: "StartNormal" },
    {  id: "Normal" },
    {  id: "NormalFinal" },
    {  id: "StartNormalFinal" },
    {  id: "Start" },
    {  id: "Abstract" },
    {  id: "Final" },
    {  id: "StartFinal" },
  ]);
  
  var blockList = blocks.map(block =>{
    return <Nodes id={block.id} setNodeContent={addNode}/>
  });

  
  return (
    <div id="blockListContainer" className='blockListContainer bordered spaced'>
    <div className='blockListTitle'> BlockListPanel </div>
    <div className='fullSeparator'/>
    <div className='blockList'>
     
        <button onClick={switchEdgeMode} className='libraryNode Normal' id='EdgeNode'>
          <ArrowRightAltIcon fontSize='large'/>
        </button>
      {blockList}
    </div>
    </div>
    );
  }

export default BlockList