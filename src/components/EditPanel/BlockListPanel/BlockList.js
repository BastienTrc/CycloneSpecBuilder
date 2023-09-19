import './BlockList.css'
import React, { useEffect } from 'react';
import Block from './Block';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

var hasBeenInit = false;

function BlockList ({ addNode, linkSeveralNodes, switchEdgeMode}) {
  
  useEffect( () => {
      document.addEventListener('keydown', (event => {
        if (event.key === "Enter"){
          event.preventDefault();
        }
      }))
  })
  
  return (
    <div id="blockListContainer" className='blockListContainer bordered spaced'>
    <div className='blockListTitle'> BlockListPanel </div>
    <div className='fullSeparator'/>
    <div className='blockList'>
    
    <button onClick={switchEdgeMode} title='Single link' className='libraryNode' id='EdgeNode'>
    <ArrowRightAltIcon fontSize='large'/>
    </button>
    <button onClick={() => linkSeveralNodes(true, false)} title='All node but itself' className='libraryNode' id='EdgeNodePlus'>
    <ArrowRightAltIcon fontSize='large'/> +
    </button>
    <button className="labelBtn" onClick={() => linkSeveralNodes(true, true)}> with label </button>
    
    <button onClick={() => linkSeveralNodes(false,false)} title='All node' className='libraryNode' id='EdgeNodeStar'>
    <ArrowRightAltIcon fontSize='large'/> * 
    </button>
    <button className="labelBtn" onClick={() => linkSeveralNodes(false, true)}> with label </button>
    <Block id={"Normal"} addNode={addNode}/>
    <Block id={"Abstract"} addNode={addNode}/>
    </div>
    </div>
    );
  }
  
  export default BlockList