import './BlockList.css'
import React from 'react';
import { useState, useEffect } from 'react';
import { setEditMode } from '../EditPanel/SpecCanvas';
import StartNode from './Blocks/StartNode';
import FinalNode from './Blocks/FinalNode';

var addedNodeContent = "";

function setNodeContent(content){
  addedNodeContent = content;
  document.getElementById("canvasInfo").innerHTML = "Click on the canvas to place the node.";
  setEditMode(true);
}

const BlockList = () => {
  // TODO Generate dynamically after
  const [blocks,setBlocks] = useState([
    { title: 'StartNode', id: 1 },
    { title: 'FinalNode', id: 3 }
  ]);
  
  // {/* <div className='copyDraggable blockLeft'>{block.title}</div> */}
  const blockList = blocks.map(block =>{
    switch (block.id) {
      case 1:
      return <StartNode id={block.id} setNodeContent={setNodeContent}/>
      case 3:
      return <FinalNode id={block.id} setNodeContent={setNodeContent}/>
      default:
      break;
    }
  }
  );
  
  return (
    <div className='blockListContainer'>
    <div className='title'> BlockListPanel </div>
    <div className='blockList'>{blockList}</div>
    {/* <button onClick={() => setBlocks(blocks.concat({title: 'newNode', id: 5}))}> add </button>  */}
    </div>
    );
  }
  export function getAddedNodeContent(){
    return addedNodeContent;
  }
  export default BlockList;