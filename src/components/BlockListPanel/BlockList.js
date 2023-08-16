import './BlockList.css'
import React from 'react';
import { useState } from 'react';
import { cancelAction, getNetwork, linkSeveralNodes, setAddNodeMode, setCanvasInfo, setNodeContent, switchEdgeMode} from '../../utils/canvas/canvasInit';
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
  const [blocks,setBlocks] = useState([
    {  id: "Normal" },
    {  id: "Abstract" },
  ]);
  
  var blockList = blocks.map(block =>{
    return <Nodes id={block.id} setNodeContent={addNode}/>
  });

  
  return (
    <div id="blockListContainer" className='blockListContainer bordered spaced'>
    <div className='blockListTitle'> BlockListPanel </div>
    <div className='fullSeparator'/>
    <div className='blockList'>
     
        <button onClick={switchEdgeMode} title='Single link' className='libraryNode Normal' id='EdgeNode'>
          <ArrowRightAltIcon fontSize='large'/>
        </button>
        <button onClick={() => linkSeveralNodes(true)} title='All node but itself' className='libraryNode Normal' id='EdgeNodePlus'>
          <ArrowRightAltIcon fontSize='large'/> +
        </button>
        <button onClick={() => linkSeveralNodes(false)} title='All node' className='libraryNode Normal' id='EdgeNodeStar'>
          <ArrowRightAltIcon fontSize='large'/> * 
        </button>
      {blockList}
    </div>
    </div>
    );
  }

export default BlockList