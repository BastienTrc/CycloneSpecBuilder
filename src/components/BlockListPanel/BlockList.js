import './BlockList.css'
import React from 'react';
import { useState, useEffect } from 'react';
import { cancelAction, getNetwork, setAddNodeMode, setCanvasInfo, setNodeContent, switchEdgeMode} from '../../utils/canvas/canvasInit';
import StartNode from './Blocks/StartNode';
import FinalNode from './Blocks/FinalNode';
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
    {  id: "StartNode" },
    {  id: "Node" },
    {  id: "EndNode" }
  ]);
  
  var blockList = blocks.map(block =>{
    return <StartNode id={block.id} setNodeContent={addNode}/>
  });

  
  return (
    <div className='blockListContainer'>
    <div className='blockListTitle'> BlockListPanel </div>
    <div className='blockListSeparator'/>
    <div className='blockList'>
      {blockList}
     
        <button onClick={switchEdgeMode} className='libraryNode' id='EdgeNode'>
          <ArrowRightAltIcon fontSize='large'/>
        </button>
    </div>
    </div>
    );
  }

  export default BlockList;